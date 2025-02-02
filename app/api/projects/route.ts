import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import { ProjectsService } from '../../../server/domain/projects';
export const runtime = 'edge';
export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const projectsService = new ProjectsService();
    const projects = await projectsService.getProjects(userId);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const project = await projectsService.createProject({
      user_id: userId,
      name,
      description,
      expense_estimation: expense_estimation || 0,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 