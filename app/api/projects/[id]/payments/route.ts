import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { ProjectPaymentsService } from '@/server/domain/project_payments';
export const runtime = 'edge';

const projectPaymentsService = new ProjectPaymentsService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payments = await projectPaymentsService.getProjectPayments(params.id, userId);
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching project payments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const payment = await projectPaymentsService.createProjectPayment({
      ...body,
      project_id: params.id,
      user_id: userId,
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating project payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId, ...updateData } = await request.json();

    // Validate status if it's being updated
    if (updateData.status && !['pending', 'paid'].includes(updateData.status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    await projectPaymentsService.updateProjectPayment(paymentId, userId, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating project payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId } = await request.json();
    await projectPaymentsService.deleteProjectPayment(paymentId, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 