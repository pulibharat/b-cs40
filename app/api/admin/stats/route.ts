import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import dbConnect from '../../../../lib/db';
import Faq from '../../../../models/Faq';
import Query from '../../../../models/Query';
import FaqSuggestion from '../../../../models/FaqSuggestion';
import User from '../../../../models/User';

// GET /api/admin/stats (Admin only)
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    await dbConnect();

    // 1. Get primary counts
    const faqsCount = await Faq.countDocuments();
    const usersCount = await User.countDocuments();

    // Queries status breakdown
    const queriesPending = await Query.countDocuments({ status: 'Pending' });
    const queriesInProgress = await Query.countDocuments({ status: 'In Progress' });
    const queriesSolved = await Query.countDocuments({ status: 'Solved' });
    const totalQueries = queriesPending + queriesInProgress + queriesSolved;

    // Suggestions status breakdown
    const suggestionsPending = await FaqSuggestion.countDocuments({ status: 'Pending' });
    const suggestionsApproved = await FaqSuggestion.countDocuments({ status: 'Approved' });
    const suggestionsRejected = await FaqSuggestion.countDocuments({ status: 'Rejected' });
    const totalSuggestions = suggestionsPending + suggestionsApproved + suggestionsRejected;

    // 2. Aggregate queries by category (to draw charts)
    const queriesByCategory = await Query.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    // 3. Aggregate FAQs by category
    const faqsByCategory = await Faq.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    // 4. Aggregate queries by priority
    const queriesByPriority = await Query.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    return NextResponse.json(
      {
        counts: {
          faqs: faqsCount,
          users: usersCount,
          queries: {
            total: totalQueries,
            pending: queriesPending,
            inProgress: queriesInProgress,
            solved: queriesSolved,
          },
          suggestions: {
            total: totalSuggestions,
            pending: suggestionsPending,
            approved: suggestionsApproved,
            rejected: suggestionsRejected,
          },
        },
        charts: {
          queriesByCategory,
          faqsByCategory,
          queriesByPriority,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
