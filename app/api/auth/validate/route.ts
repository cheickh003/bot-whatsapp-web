import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID requis' },
        { status: 400 }
      );
    }

    // For development, accept any valid session format
    // In production, this should validate against the database
    if (sessionId && sessionId.length > 10) {
      // Temporary validation for development
      return NextResponse.json({
        phoneNumber: '2250703079410',
        name: 'Admin',
        sessionId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Try to validate with database
    const session = await validateSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session invalide ou expirée' },
        { status: 401 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}