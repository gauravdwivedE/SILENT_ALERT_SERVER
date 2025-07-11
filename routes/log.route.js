import { Router } from 'express'
import { authenticate } from '../middlewares/authentication.js'
import { getLogs } from '../controllers/log.controller.js'
import  { isBlockedUser }  from '../middlewares/isBlockedUser.js';
import authorize from '../middlewares/authorization.js';

const router = Router()

router.use(authenticate)
router.use(isBlockedUser)

router.get("/", authorize(['admin', 'superAdmin']), getLogs)


export default router