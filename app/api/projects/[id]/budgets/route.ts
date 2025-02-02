import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import { ProjectBudgetService } from '../../../../../server/domain/budget';
import { ProjectsService } from '../../../../../server/domain/projects';

export const runtime = 'edge';

// GET /api/projects/[id]/budgets
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify project ownership
    const projectsService = new ProjectsService();
    const project = await projectsService.getProject(params.id, userId);
    
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    const budgetService = new ProjectBudgetService();
    const budgets = await budgetService.getBudgets(params.id);

    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/projects/[id]/budgets
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify project ownership
    const projectsService = new ProjectsService();
    const project = await projectsService.getProject(params.id, userId);
    
    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    const body = await request.json();
    const { name, description, estimated_amount } = body;

    if (!name || estimated_amount === undefined) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const budgetService = new ProjectBudgetService();
    const budget = await budgetService.createBudget({
      project_id: params.id,
      name,
      description,
      estimated_amount,
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 