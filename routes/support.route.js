import { Router } from 'express'
import { createSupport, getAllSupports, updateSupportStatus, getUsersSupport} from '../controllers/support.controller.js'
import { authenticate } from '../middlewares/authentication.js'
import authorize from '../middlewares/authorization.js';

const router = Router()

router.use(authenticate)

router.post("/", createSupport)
router.get("/", authorize(['superAdmin']), getAllSupports)
router.patch("/:id/status", authorize(['admin', 'superAdmin']), updateSupportStatus)
router.get("/users", getUsersSupport)

export default router