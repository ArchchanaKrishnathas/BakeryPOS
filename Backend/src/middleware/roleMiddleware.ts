import { Request, Response, NextFunction, RequestHandler } from "express";

// Role-based authorization middleware
export const authorizeRoles = (...allowedRoles: ("admin" | "staff" | "user")[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized: No user data found" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden: Access Denied" });
      return;
    }

    next();
  };
};
