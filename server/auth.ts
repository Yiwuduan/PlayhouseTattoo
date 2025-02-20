import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
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
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // Simple password check
      if (password === MASTER_PASSWORD) {
        return done(null, { id: 1, isAdmin: "true" });
      }
      return done(null, false);
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    done(null, { id: 1, isAdmin: "true" });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Admin middleware
  const requireAdmin = (req: Express.Request, res: Express.Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(403).send("Unauthorized");
    }
    next();
  };

  // Protected admin routes
  app.use("/api/admin", requireAdmin);
}