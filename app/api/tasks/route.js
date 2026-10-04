import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(userId);
  return NextResponse.json(tasks);
}

export async function POST(req) {
  const { userId, title } = await req.json();
  if (!title || title.trim() === '') {
    return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
  }
  const stmt = db.prepare('INSERT INTO tasks (user_id, title) VALUES (?, ?)');
  const info = stmt.run(userId, title);
  return NextResponse.json({ id: info.lastInsertRowid, title, completed: 0 });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}