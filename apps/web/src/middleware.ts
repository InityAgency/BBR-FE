import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Ako je ruta za developer ili buyer panel
  if ((path.startsWith('/developer') || path.startsWith('/buyer')) && 
      !path.includes('/login') && 
      !path.includes('/register')) {
    
    // Provera sesije
    const session = request.cookies.get('bbr-session');
    const user = request.cookies.get('user');
    
    if (!session || !user) {
      // Sačuvaj trenutnu putanju kao returnUrl za povratak nakon logina
      const returnUrl = request.nextUrl.pathname + request.nextUrl.search;
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', returnUrl);
      
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      const userData = JSON.parse(user.value);
      const role = userData.role?.name;
      
      // Provera da li korisnik ima odgovarajuću rolu
      if (path.startsWith('/developer') && role !== 'developer') {
        return NextResponse.redirect(new URL('/buyer/dashboard', request.url));
      }
      
      if (path.startsWith('/buyer') && role !== 'buyer') {
        return NextResponse.redirect(new URL('/developer/dashboard', request.url));
      }
    } catch (error) {
      // Ako je došlo do greške pri parsiranju user podataka, vrati na login uz čuvanje returnUrl
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