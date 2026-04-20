import { Router } from "express";
import userRouter from "./user.routes.js";
import adminRouter from "./admin.routes.js";
import shopRouter from "./shop.routes.js";
import friendRouter from "./friend.routes.js";
import blockRouter from "./block.routes.js";
import notificationRouter from "./notification.routes.js";

const rootRouter = Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/admin", adminRouter);
rootRouter.use("/shop", shopRouter);
rootRouter.use("/friend", friendRouter);
rootRouter.use("/block", blockRouter);
rootRouter.use("/notification", notificationRouter);

export default rootRouter;