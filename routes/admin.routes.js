import { Router } from "express";
import { createFaq, createPrivacyPolicy } from "../controllers/admin.controller.js";

import { auth, isAdmin } from "../middlewares/auth.js";

const adminRouter = Router();

adminRouter.post("/faq", auth, isAdmin, createFaq);
adminRouter.post("/privacy-policy", auth, isAdmin, createPrivacyPolicy);


export default adminRouter;
