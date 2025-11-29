import { Router } from "express";
import { me, signin, signup } from "../controllers/auth,controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/me", protectRoute, me);

