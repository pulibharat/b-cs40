import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import dbConnect from '../../../../../lib/db';
import FaqSuggestion from '../../../../../models/FaqSuggestion';

// PUT /api/faq-suggestions/[id]/reject (Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { adminReview } = body;

    if (!adminReview) {
      return NextResponse.json({ message: 'Please provide a rejection reason (adminReview).' }, { status: 400 });
    }

    await dbConnect();

    const suggestion = await FaqSuggestion.findById(id);

    if (!suggestion) {
      return NextResponse.json({ message: 'FAQ suggestion not found' }, { status: 404 });
    }

    if (suggestion.status !== 'Pending') {
      return NextResponse.json({ message: 'Suggestion has already been reviewed' }, { status: 400 });
    }

    // Update suggestion
    suggestion.status = 'Rejected';
    suggestion.adminReview = adminReview;
    await suggestion.save();

    return NextResponse.json(
      { message: 'Suggestion rejected successfully', suggestion },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error rejecting suggestion:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
