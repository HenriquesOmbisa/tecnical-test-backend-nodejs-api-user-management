import { JwtPayload } from "@/infra/auth/jwt.service";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
