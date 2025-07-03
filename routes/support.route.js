import { Router } from 'express'
import { createSupport, getAllSupports, updateSupportStatus, getUsersSupport} from '../controllers/support.controller.js'
import { authenticate, isAdmin } from '../middlewares/authentication.js'

const router = Router()

router.use(authenticate)

router.post("/", createSupport)
router.get("/", isAdmin, getAllSupports)
router.patch("/:id/status", isAdmin, updateSupportStatus)
router.get("/users", getUsersSupport)

export default router