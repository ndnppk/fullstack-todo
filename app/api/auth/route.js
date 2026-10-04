import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { action, username, password } = await req.json();

  if (action === 'register') {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      const info = stmt.run(username, hashedPassword);
      return NextResponse.json({ success: true, userId: info.lastInsertRowid, username });
    } catch (err) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }
  }

  if (action === 'login') {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ success: true, userId: user.id, username: user.username });
  }
}