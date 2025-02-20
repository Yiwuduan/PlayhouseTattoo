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
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username: string, password: string, done) => {
      try {
        // Simple password check, ignore username
        if (password === MASTER_PASSWORD) {
          return done(null, { id: 1, isAdmin: "true" });
        }
        return done(null, false, { message: "Invalid password" });
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id: number, done) => {
    done(null, { id: 1, isAdmin: "true" });
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login attempt with:", { password: req.body.password });
    passport.authenticate("local", (err: any, user: Express.User | false, info: { message?: string } | undefined) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      if (!user) {
        console.log("Authentication failed:", info?.message);
        return res.status(401).json({ message: info?.message || "Invalid password" });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        console.log("Authentication successful for user:", user);
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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  const requireAdmin = (req: Express.Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };

  app.use("/api/admin", requireAdmin);
}