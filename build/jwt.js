"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifTokenAdmin = exports.verifTokenAndAuthorizaton = exports.verifToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn, algorithm: "RS256" });
    return token;
};
exports.generateToken = generateToken;
// using req from CustomRequest interface
const verifToken = (req, res, next, secret) => {
    const auth_header = req.headers.token;
    // check token in headers
    if (auth_header) {
        const token = Array.isArray(auth_header)
            ? auth_header[0].split(" ")[1]
            : auth_header.split(" ")[1];
        jsonwebtoken_1.default.verify(token, secret, (err, user) => {
            if (err) {
                res.status(403).json({
                    status: false,
                    statusCode: 403,
                    message: "Token is not valid"
                });
            }
            else {
                //   if token true, return next()
                req.user = user; // req.user, check in interface CustomRequest
                next();
            }
        });
    }
    else {
        //   when token nothing, send 401
        res.status(401).json({
            tatus: false,
            statusCode: 401,
            message: "Unauthorized"
        });
    }
};
exports.verifToken = verifToken;
// authorize middleware
const verifTokenAndAuthorizaton = (req, res, next, secret) => {
    (0, exports.verifToken)(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === "admin") {
            next();
        }
        else {
            res.status(403).json({
                status: false,
                statusCode: 403,
                message: "You are not allowed to access this resources"
            });
        }
    }, secret);
};
exports.verifTokenAndAuthorizaton = verifTokenAndAuthorizaton;
// authorize middleware for
const verifTokenAdmin = (req, res, next, secret) => {
    (0, exports.verifToken)(req, res, () => {
        if (req.user.role !== "admin") {
            res.status(403).json({
                status: false,
                statusCode: 403,
                message: "You are not allowed to access this resources"
            });
        }
        next();
    }, secret);
};
exports.verifTokenAdmin = verifTokenAdmin;
