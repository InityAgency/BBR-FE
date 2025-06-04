import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const accountType = searchParams.get('accountType');

        // Google OAuth configuration
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
        const scope = 'email profile';

        // Store account type in state parameter for callback if it exists
        const state = accountType 
            ? Buffer.from(JSON.stringify({ accountType })).toString('base64')
            : Buffer.from(JSON.stringify({ isLogin: true })).toString('base64');

        // Construct Google OAuth URL
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.append('client_id', clientId!);
        authUrl.searchParams.append('redirect_uri', redirectUri);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', scope);
        authUrl.searchParams.append('state', state);
        authUrl.searchParams.append('access_type', 'offline');
        authUrl.searchParams.append('prompt', 'consent');

        return NextResponse.redirect(authUrl.toString());
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.json(
            { error: 'Failed to initiate Google authentication' },
            { status: 500 }
        );
    }
} 