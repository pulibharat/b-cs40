import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import dbConnect from '../../../../../lib/db';
import Query from '../../../../../models/Query';

// PUT /api/queries/[id]/reply (Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const { id } = await params;
    const { adminReply } = await req.json();

    if (!adminReply) {
      return NextResponse.json({ message: 'Reply content is required' }, { status: 400 });
    }

    await dbConnect();

    // Find and update query
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      {
        adminReply,
        status: 'Solved', // Automatically mark as Solved when replied, or keep it custom
      },
      { new: true }
    );

    if (!updatedQuery) {
      return NextResponse.json({ message: 'Query not found' }, { status: 404 });
    }

    return NextResponse.json(updatedQuery, { status: 200 });
  } catch (error: any) {
    console.error('Error replying to query:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
