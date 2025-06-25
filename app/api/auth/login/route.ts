import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPin, createAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, pin } = body;

    if (!phoneNumber || !pin) {
      return NextResponse.json(
        { error: 'Numéro de téléphone et PIN requis' },
        { status: 400 }
      );
    }

    // Verify PIN
    const isValidPin = await verifyAdminPin(phoneNumber, pin);
    if (!isValidPin) {
      return NextResponse.json(
        { error: 'PIN invalide' },
        { status: 401 }
      );
    }

    // Create session
    try {
      const session = await createAdminSession(phoneNumber);
      return NextResponse.json(session);
    } catch (error) {
      // If user not found in admin_users, create a temporary session
      // This is for initial setup when admin_users collection might be empty
      const tempSession = {
        phoneNumber,
        name: 'Admin',
        sessionId: Math.random().toString(36).substring(2) + Date.now().toString(36),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      
      return NextResponse.json(tempSession);
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}