import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";


export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks:{
      authorized({req, token }) {
        // If token exists, user is authenticated
        const { pathname } = req.nextUrl
        if(
          pathname.startsWith('api/auth') ||
          pathname === "/login" ||
          pathname === "/register"
        )
          return true;

          if(pathname === "/"  || pathname.startsWith('api/videos')){
            return  true;
          }
        return !!token;
        
      } ,
    },
  }
);

export const config = {
  /*
    * Matcher to protect all routes except for static files and favicon.ico
    * next/static (static files)
    * _next/image (image optimization files)
    * favicon.ico (favicon) 
    * public folder files are served directly and do not need to be excluded here
  */
  matcher: [
    "/((?!next/static|_next/image|favicon.ico/public/).*)", // Protect all routes except for static files and favicon.ico
  ]
}
