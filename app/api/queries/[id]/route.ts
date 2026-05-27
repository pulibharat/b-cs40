import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import dbConnect from '../../../../lib/db';
import Query from '../../../../models/Query';

// GET /api/queries/[id] (Protected: Owner or Admin)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    const query = await Query.findById(id);

    if (!query) {
      return NextResponse.json({ message: 'Query not found' }, { status: 404 });
    }

    // Check permissions
    if (session.user.role !== 'admin' && query.userId.toString() !== session.user.id) {
      return NextResponse.json({ message: 'Forbidden. Access denied.' }, { status: 403 });
    }

    return NextResponse.json(query, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching query:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
