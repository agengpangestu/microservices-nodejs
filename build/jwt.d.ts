import { Request, Response, NextFunction } from "express";
import { VerifyErrors, Secret } from "jsonwebtoken";
export type JWTPayload = {
    id: string;
    email: string;
    role: string;
};
export interface CustomeRequest extends Request {
    user: JWTPayload;
    params: {
        id: string;
    };
    headers: {
        token?: string;
    };
}
export type { Secret, VerifyErrors, NextFunction };
export declare const generateToken: (payload: JWTPayload, secret: Secret, expiresIn: string) => string;
export declare const verifToken: (req: CustomeRequest, res: Response, next: NextFunction, secret: Secret) => void;
export declare const verifTokenAndAuthorizaton: (req: CustomeRequest, res: Response, next: NextFunction, secret: Secret) => void;
export declare const verifTokenAdmin: (req: CustomeRequest, res: Response, next: NextFunction, secret: Secret) => void;
//# sourceMappingURL=jwt.d.ts.map