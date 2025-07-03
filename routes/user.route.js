import { Router } from 'express'
import { login, signup, oAuthLogin, getLoginUser, updateProfile, updateUserStatus, getUserById, updateUserRole, usersSummary} from '../controllers/user.controller.js'
import { authenticate, isAdmin } from '../middlewares/authentication.js'
const router = Router()

router.post("/", signup)
router.post("/login", login)
router.post("/oauth", oAuthLogin)
router.get("/login", authenticate, getLoginUser)
router.get("/summary",authenticate, isAdmin, usersSummary)
router.get("/:id",authenticate, isAdmin, getUserById)
router.put("/", authenticate, updateProfile)
router.patch("/:id/status",authenticate, isAdmin, updateUserStatus)
router.patch("/:id/role",authenticate, isAdmin, updateUserRole)
export default router