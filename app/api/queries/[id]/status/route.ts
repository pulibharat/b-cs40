import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import dbConnect from '../../../../../lib/db';
import Query from '../../../../../models/Query';

// PUT /api/queries/[id]/status (Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized. Admin role required.' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!status || !['Pending', 'In Progress', 'Solved'].includes(status)) {
      return NextResponse.json({ message: 'Invalid or missing status value' }, { status: 400 });
    }

    await dbConnect();

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedQuery) {
      return NextResponse.json({ message: 'Query not found' }, { status: 404 });
    }

    return NextResponse.json(updatedQuery, { status: 200 });
  } catch (error: any) {
    console.error('Error updating query status:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
