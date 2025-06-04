import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent(error)}`
            );
        }

        if (!code || !state) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('Missing required parameters')}`
            );
        }

        // Decode state to get account type
        const { accountType } = JSON.parse(Buffer.from(state, 'base64').toString());

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for tokens');
        }

        const tokens = await tokenResponse.json();

        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });

        if (!userInfoResponse.ok) {
            throw new Error('Failed to get user info from Google');
        }

        const userInfo = await userInfoResponse.json();

        // Register or login user with backend
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userInfo.email,
                fullName: userInfo.name,
                googleId: userInfo.id,
                accountType,
            }),
        });

        if (!authResponse.ok) {
            throw new Error('Failed to authenticate with backend');
        }

        const authResult = await authResponse.json();

        // Store tokens in cookies
        const response = NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/${accountType}`
        );

        response.cookies.set('accessToken', authResult.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        response.cookies.set('refreshToken', authResult.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Google callback error:', error);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${encodeURIComponent('Authentication failed')}`
        );
    }
} 