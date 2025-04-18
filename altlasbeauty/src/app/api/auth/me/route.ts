// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // 1. Vérification du token
    const token = (await cookies()).get('BEARER')?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 401 }
      );
    }

    // 2. Appel à l'API Symfony
    const apiResponse = await fetch(`${process.env.API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // 3. Vérification du Content-Type
    const contentType = apiResponse.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await apiResponse.text();
      console.error('Réponse non-JSON:', text);
      throw new Error("Format de réponse invalide");
    }

    // 4. Traitement de la réponse
    const data = await apiResponse.json();
    return NextResponse.json({
      member: [
        data.id,
        data.email,
        data.firstName || '',
        data.lastName || '',
        data.userType || 'patient'
      ]
    });

  } catch (error: any) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}