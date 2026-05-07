import { withAuth } from "next-auth/middleware";

import { authSecret } from "@/lib/auth/secret";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  secret: authSecret,
});

export const config = {
  matcher: ["/admin/:path*"],
};
