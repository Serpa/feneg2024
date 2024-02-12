import { withAuth } from "next-auth/middleware";

export default withAuth(
    {
        callbacks: {
            authorized: ({ req, token }: { req: any; token: any }) => {
                if (req.nextUrl.pathname.startsWith('/admin/') && token === null) return false
                return true
            }
        }
    }
)