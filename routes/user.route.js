import { Router } from 'express'
import { login, signup, oAuthLogin, getLoginUser, updateProfile, updateUserStatus, getUserById, updateUserRole, usersSummary} from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/authentication.js'
import { isBlockedUser } from '../middlewares/isBlockedUser.js'
import authorize from '../middlewares/authorization.js';
import limiter from '../config/rateLimit.js';

const router = Router()

router.post("/", limiter, signup)
router.post("/login", limiter,login)
router.post("/oauth", limiter, oAuthLogin)

router.use(authenticate)
router.get("/login", getLoginUser)
router.use(limiter)
router.use(isBlockedUser)

router.get("/summary", authorize(['admin', 'superAdmin', 'inspector']), usersSummary)
router.get("/:id",authorize(['superAdmin']), getUserById)
router.put("/", updateProfile)
router.patch("/:id/status", authorize(['superAdmin', 'admin']), updateUserStatus) // admin / super 
router.patch("/:id/role", authorize(['superAdmin']), updateUserRole)
export default router