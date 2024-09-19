import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors, Secret, JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export type JWTPayload = {
  id: string;
  email: string;
  role: string;
};

// make custom request interface and extends to Request from express
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

export const generateToken = (payload: JWTPayload, secret: Secret, expiresIn: string): string => {
  const token = jwt.sign(payload, secret, { expiresIn, algorithm: "RS256" });
  return token;
};

// using req from CustomRequest interface
export const verifToken = (req: CustomeRequest, res: Response, next: NextFunction, secret: Secret): void => {
    
  const auth_header = req.headers.token;

    // check token in headers
  if (auth_header) {
      const token = Array.isArray(auth_header)
          ? auth_header[0].split(" ")[1]
          : auth_header.includes(" ")
              ? auth_header.split(" ")[1] 
              : auth_header;
      
      jwt.verify(token, secret, (err: VerifyErrors | null, user: any) => {
          if (err?.name === "JsonWebTokenError") {
              res.status(403).json({
                  status: false,
                  statusCode: 403,
                  message: "Token is not valid"
              })
          } else if (err?.name === "TokenExpiredError") {
              res.status(403).json({
                  status: false,
                  statusCode: 403,
                  message: "Token expired"
              })
          } else {
            //   if token true, return next()
              req.user = user // req.user, check in interface CustomRequest
              next()
          }
      })
  } else {
    //   when token nothing, send 401
      res.status(401).json({
        tatus: false,
        statusCode: 401,
        message: "Unauthorized"
      })
  }
};

// authorize middleware
export const verifTokenAndAuthorizaton = (req: CustomeRequest, res: Response, next: NextFunction, secret: Secret): void => {
    verifToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === "admin") {
            next()
        } else {
            res.status(403).json({
                status: false,
                statusCode: 403,
                message: "You are not allowed to access this resources"
            })
        }
    }, secret)
};

// authorize middleware for
export const verifTokenAdmin = (req: CustomeRequest, res: Response, next: NextFunction, secret: Secret): void => {
    verifToken(req, res, () => {
        if (req.user.role !== "admin") {
            res.status(403).json({
                status: false,
                statusCode: 403,
                message: "You are not allowed to access this resources"
            })
        }

        next()
    }, secret)
};