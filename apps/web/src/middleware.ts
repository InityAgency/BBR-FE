import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Preskačemo middleware za auth rute i statične resurse
  if (path.startsWith('/api/') || 
      path.startsWith('/_next/') || 
      path.startsWith('/login') || 
      path.startsWith('/register') ||
      path.startsWith('/auth/')) {
    return NextResponse.next();
  }
  
  // Ako je ruta za developer ili buyer panel
  if (path.startsWith('/developer') || path.startsWith('/buyer')) {
    // Provera sesije
    const session = request.cookies.get('bbr-session');
    
    if (!session) {
      // Sačuvaj trenutnu putanju kao returnUrl za povratak nakon logina
      const returnUrl = request.nextUrl.pathname + request.nextUrl.search;
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', returnUrl);
      
      return NextResponse.redirect(loginUrl);
    }
    
    // Proveri sa backend-om da li je sesija validna
    try {
      const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/me`, {
        headers: {
          'Cookie': `bbr-session=${session.value}`,
        },
      });
      
      if (!meResponse.ok) {
        const returnUrl = request.nextUrl.pathname + request.nextUrl.search;
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('returnUrl', returnUrl);
        
        return NextResponse.redirect(loginUrl);
      }
      
      const userData = await meResponse.json();
      const role = userData.data?.role?.name;
      
      // Provera da li korisnik ima odgovarajuću rolu
      if (path.startsWith('/developer') && role !== 'developer') {
        return NextResponse.redirect(new URL('/buyer/dashboard', request.url));
      }
      
      if (path.startsWith('/buyer') && role !== 'buyer') {
        return NextResponse.redirect(new URL('/developer/dashboard', request.url));
      }
    } catch (error) {
      console.error('Middleware auth check error:', error);
      const returnUrl = request.nextUrl.pathname + request.nextUrl.search;
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', returnUrl);
      
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// Samo za rute koje počinju sa /developer ili /buyer
export const config = {
  matcher: ['/developer/:path*', '/buyer/:path*'],
};