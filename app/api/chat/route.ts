import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Faq from '../../../models/Faq';
import ChatHistory from '../../../models/ChatHistory';

// Common stop words to filter out before searching
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
  'a', 'an', 'the', 'and', 'but', 'if', 'or', 'so', 'as', 'of',
  'at', 'by', 'for', 'with', 'about', 'to', 'from', 'in', 'on',
  'will', 'would', 'can', 'could', 'should', 'shall', 'may', 'might',
  'not', 'no', 'nor', 'don', 'doesn', 'didn', 'won', 'wouldn',
  'there', 'here', 'when', 'where', 'why', 'how', 'all', 'any',
  'both', 'each', 'more', 'most', 'some', 'such', 'than', 'too',
  'very', 'just', 'also', 'only', 'own', 'same', 'tell', 'get',
  'please', 'hi', 'hello', 'hey', 'thanks', 'thank',
]);

// Minimum textScore to accept a match as relevant
const MIN_TEXT_SCORE = 1.5;

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

export async function POST(req: Request) {
  try {
    const { message, userId } = await req.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    await dbConnect();

    const keywords = extractKeywords(message);

    let answer = '';
    let suggestions: { question: string }[] = [];
    let isFallback = false;

    // 1. Try MongoDB $text search with keyword-only query
    let matches: any[] = [];
    if (keywords.length > 0) {
      const searchQuery = keywords.join(' ');
      const rawMatches = await Faq.find(
        { $text: { $search: searchQuery } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5);

      // Filter by minimum relevance score
      matches = rawMatches.filter(
        (m: any) => (m as any)._doc.score >= MIN_TEXT_SCORE
      );
    }

    // 2. Fallback: regex search on question field if text search gave no good results
    if (matches.length === 0 && keywords.length > 0) {
      const regexPatterns = keywords.map(
        (kw) => new RegExp(kw, 'i')
      );
      // Find FAQs where the question contains at least 2 keywords (or 1 if only 1 keyword)
      const minKeywordMatch = Math.min(keywords.length, 2);
      const regexResults = await Faq.find({
        question: { $in: regexPatterns.map((r) => r) },
      }).limit(10);

      // Score by how many keywords appear in the question
      const scored = regexResults
        .map((faq: any) => {
          const q = faq.question.toLowerCase();
          const hitCount = keywords.filter((kw) => q.includes(kw)).length;
          return { faq, hitCount };
        })
        .filter((item) => item.hitCount >= minKeywordMatch)
        .sort((a, b) => b.hitCount - a.hitCount);

      matches = scored.slice(0, 3).map((item) => item.faq);
    }

    if (matches.length > 0) {
      answer = matches[0].answer;
      suggestions = matches.slice(1, 3).map((m: any) => ({
        question: m.question,
      }));
    } else {
      isFallback = true;
      answer = "I'm sorry, I couldn't find a direct answer to your question about the Vicharanashala Internship in our database. You can try searching our FAQ page, suggest this FAQ to admins, or raise a support query to get human coordinator assistance.";
    }

    // 2. Save exchange in chatHistory if userId is provided
    if (userId) {
      try {
        const userExchange = [
          { sender: 'user', text: message, timestamp: new Date() },
          { sender: 'bot', text: answer, timestamp: new Date() },
        ];

        const existingHistory = await ChatHistory.findOne({ userId });

        if (existingHistory) {
          existingHistory.messages.push(...(userExchange as any));
          await existingHistory.save();
        } else {
          await ChatHistory.create({
            userId,
            messages: userExchange,
          });
        }
      } catch (dbErr) {
        console.error('Failed to save chat history:', dbErr);
        // Do not crash the API, proceed to return response
      }
    }

    return NextResponse.json(
      {
        answer,
        suggestions,
        isFallback,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
