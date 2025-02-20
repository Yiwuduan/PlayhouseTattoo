import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Response } from "express";
import session from "express-session";
import { storage } from "./storage";

declare global {
  namespace Express {
    interface User {
      id: number;
      isAdmin: string;
    }
  }
}

const MASTER_PASSWORD = process.env.MASTER_PASSWORD || "tattoo2024";

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "tattoo-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy((username, password, done) => {
      // Simple password check, ignore username
      if (password === MASTER_PASSWORD) {
        return done(null, { id: 1, isAdmin: "true" });
      }
      return done(null, false, { message: "Invalid password" });
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id: number, done) => {
    done(null, { id: 1, isAdmin: "true" });
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid password" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    res.json(req.user);
  });

  // Admin middleware
  const requireAdmin = (req: Express.Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };

  // Protected admin routes
  app.use("/api/admin", requireAdmin);
}