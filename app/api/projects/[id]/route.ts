import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import { ProjectsService } from '../../../../server/domain/projects';
export const runtime = 'edge';
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

    const projectsService = new ProjectsService();
    const project = await projectsService.getProject(params.id, userId);

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, description, expense_estimation } = body;

    if (!name || !description) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const projectsService = new ProjectsService();
    const project = await projectsService.updateProject(params.id, userId, {
      name,
      description,
      expense_estimation,
    });

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const projectsService = new ProjectsService();
    const success = await projectsService.deleteProject(params.id, userId);

    if (!success) {
      return new NextResponse('Project not found', { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 