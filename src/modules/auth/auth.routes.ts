import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

// post method
// http://localhost:5500/auth/signin
router.post("/signin", authControllers.signinUser);

export const authRoutes = router;