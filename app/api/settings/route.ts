import { getSession } from '@auth0/nextjs-auth0/edge';
import { executeQuery } from '@/server/services';
import { NextResponse } from 'next/server';

export const runtime = "edge";

export async function GET() {
  try {
    const session = await getSession();
    console.log('session', JSON.stringify(session, null, 2));
    const userId = session?.user.sub;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await executeQuery<{ id: string; key: string; value: string }>(
      'SELECT id, key, value FROM settings WHERE user_id = ?',
      [userId]
    );

    console.log('settings', JSON.stringify(settings, null, 2));

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const userId = session?.user.sub;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, value } = await request.json();
    
    if (!key || !value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // validate key is unique
    const existingKey = await executeQuery(
      'SELECT COUNT(*) FROM settings WHERE user_id = ? AND key = ?',
      [userId, key]
    );

    if (existingKey.length > 0) {
      return NextResponse.json({ error: 'Key already exists' }, { status: 400 });
    }

    const result = await executeQuery(
      'INSERT INTO settings (id, user_id, key, value) VALUES (?, ?, ?, ?) Returning *',
      [crypto.randomUUID(), userId, key, value]
    );

    console.log('result', JSON.stringify(result, null, 2));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating setting:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 