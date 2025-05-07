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
      return NextResponse.redirect(new URL('/login', request.url));
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
      // Ako je došlo do greške pri parsiranju user podataka
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Samo za rute koje počinju sa /developer ili /buyer
export const config = {
  matcher: ['/developer/:path*', '/buyer/:path*'],
};