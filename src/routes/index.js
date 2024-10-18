import { errorMDW, notfound, reponseMDW } from "../middlewares/index.js";
import employeesRoutes from "./employeesRoutes.js"

import { Router } from "express"

const router = Router();


router.use(reponseMDW);
router.use("/api", router);
router.use("/employees", employeesRoutes);
router.use(notfound)
router.use(errorMDW);



export default router;