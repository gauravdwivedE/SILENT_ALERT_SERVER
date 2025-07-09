import { Router } from 'express'
import { login, signup, oAuthLogin, getLoginUser, updateProfile, updateUserStatus, getUserById, updateUserRole, usersSummary} from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/authentication.js'
import { isBlockedUser } from '../middlewares/isBlockedUser.js'
import authorize from '../middlewares/authorization.js';

const router = Router()

router.post("/", signup)
router.post("/login", login)
router.post("/oauth", oAuthLogin)

router.use(authenticate)
router.get("/login", getLoginUser)
router.use(isBlockedUser)

router.get("/summary", authorize(['admin', 'superAdmin', 'inspector']), usersSummary)
router.get("/:id",authorize(['superAdmin']), getUserById)
router.put("/", updateProfile)
router.patch("/:id/status", authorize(['superAdmin', 'admin']), updateUserStatus) // admin / super 
router.patch("/:id/role", authorize(['superAdmin']), updateUserRole)
export default router