import { getSession } from '@auth0/nextjs-auth0/edge';
import { executeQuery } from '@/server/services';
import { NextResponse } from 'next/server';

export const runtime = "edge";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
            'UPDATE settings SET key = ?, value = ? WHERE id = ? AND user_id = ? Returning *',
            [key, value, params.id, userId]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        console.error('Error updating setting:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        const userId = session?.user.sub;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await executeQuery(
            'DELETE FROM settings WHERE id = ? AND user_id = ?',
            [params.id, userId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting setting:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 