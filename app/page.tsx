import React from 'react';
import Link from 'next/link';
import dbConnect from '../lib/db';
import Faq from '../models/Faq';
import Navbar from '../components/Navbar';
import { Sparkles, HelpCircle, ArrowRight, CornerDownRight, CheckCircle2, LifeBuoy, FileText } from 'lucide-react';

export const revalidate = 60; // Cache and revalidate home page every minute

export default async function HomePage() {
  let seededFaqs: any[] = [];

  try {
    await dbConnect();
    // Fetch 6 FAQs to display as preview
    seededFaqs = await Faq.find({}).limit(6).lean();
  } catch (err) {
    console.error('Failed to fetch FAQs for home page:', err);
  }

  return (
    <div className="flex-1 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        {/* Colorful glows */}
        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[60%] bg-purple-200/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Vicharanashala Intern Support
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Yaksha Internship <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Support Portal</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Need clarifications about certificates, timing, Rosetta journals, or team formation? Access our comprehensive FAQ repository or speak to our smart assistant, Yaksha Mini.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/faqs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              Browse Program FAQs
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/raise-query"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Raise Support Ticket
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Section: RAISE / YAKSHA MINI / SOLVE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-100 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Three Steps to Resolve Any Issue
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-lg mx-auto">
              We leverage smart search engines and coordinator queues to guarantee lightning-fast support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-4 relative overflow-hidden group">
              <span className="absolute top-4 right-4 text-7xl font-extrabold text-slate-100/70 select-none group-hover:scale-105 transition-transform">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900">1. Search & Raise</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Search our indexed database of 50+ official policy entries. If your question is novel, raise a support query directly from your dashboard in under 30 seconds.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-4 relative overflow-hidden group">
              <span className="absolute top-4 right-4 text-7xl font-extrabold text-slate-100/70 select-none group-hover:scale-105 transition-transform">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900">2. Speak with Yaksha</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Engage with our AI-powered Yaksha Mini chatbot floating on the bottom-right. It performs high-speed text search to deliver verified answers and dynamic fallback suggestions.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-4 relative overflow-hidden group">
              <span className="absolute top-4 right-4 text-7xl font-extrabold text-slate-100/70 select-none group-hover:scale-105 transition-transform">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900">3. Solved by Experts</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Coordinators monitor pending student questions and suggestions daily. Queries receive detailed answers with real-time progress tracking, sent straight to your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top FAQs Grid Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Popular Intern Questions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Quick preview of common inquiries answered by the Vicharanashala team.
              </p>
            </div>
            <Link
              href="/faqs"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-bold group hover:underline shrink-0"
            >
              See all 50+ FAQs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seededFaqs.map((faq: any) => (
              <div
                key={faq._id.toString()}
                className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold rounded-lg mb-4">
                    {faq.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 flex items-start gap-2 leading-snug">
                    <HelpCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {faq.answer}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                  <Link
                    href={`/faqs?category=${encodeURIComponent(faq.category)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    View Category
                    <CornerDownRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          {/* Glowing aura */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px]" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4 border border-white/10">
                <LifeBuoy className="w-4 h-4 animate-spin-slow" />
                Still stuck?
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Can't find your answer?
              </h2>
              <p className="mt-3 text-sm text-blue-100 leading-relaxed">
                Raise an official query and we will evaluate the case. Coordinators usually reply within a couple of working hours.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <Link
                href="/raise-query"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-blue-600 font-bold text-sm rounded-xl transition-colors shadow-lg cursor-pointer"
              >
                Raise Query
              </Link>
              <Link
                href="/query-status"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-700/50 hover:bg-blue-700/80 text-white font-bold text-sm rounded-xl border border-blue-500/30 transition-colors cursor-pointer"
              >
                Track Ticket Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-white mt-auto border-t border-slate-800 shrink-0 font-sans text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600 text-white rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-extrabold text-sm tracking-tight text-white">Yaksha Portal</span>
          </div>

          <p className="text-slate-400 text-center">
            &copy; {new Date().getFullYear()} Vicharanashala Lab for Education Design, IIT Ropar. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a href="https://samagama.in/internship/faq" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
              Official Samagama FAQ
            </a>
            <span className="text-slate-700">|</span>
            <Link href="/admin/login" className="text-slate-400 hover:text-white transition-colors">
              Admin Entry
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
