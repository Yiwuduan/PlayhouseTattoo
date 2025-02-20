import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Response, NextFunction } from "express";
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

  // Error handling middleware
  app.use((err: Error, req: Express.Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "An error occurred", error: err.message });
  });

  app.post("/api/login", (req, res, next) => {
    if (!req.body || !req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }

    passport.authenticate("local", (err: any, user: Express.User | false, info: { message?: string } | undefined) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
      }

      if (!user) {
        console.log("Authentication failed:", info?.message);
        return res.status(401).json({ message: info?.message || "Invalid password" });
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ message: "Login failed", error: err.message });
        }
        console.log("Authentication successful for user:", user);
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed", error: err.message });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  const requireAdmin = (req: Express.Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    next();
  };

  app.use("/api/admin", requireAdmin);
}