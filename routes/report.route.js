import { Router } from 'express'
import { createReport, updateReport, deleteReport, updateReportStatus, getAllReports, getUserReports, reportsSummary } from '../controllers/report.controller.js'
import { authenticate } from '../middlewares/authentication.js'
import  { isBlockedUser }  from '../middlewares/isBlockedUser.js';
import authorize from '../middlewares/authorization.js';

const router = Router()

router.use(authenticate)
router.use(isBlockedUser)

router.post("/", createReport)
router.put("/:id", updateReport)
router.delete("/:id", deleteReport)

router.patch("/:id/status", authorize(['admin', 'superAdmin']), updateReportStatus)
router.get("/", authorize(['admin', 'superAdmin', 'inspector']), getAllReports)
router.get("/users", getUserReports)
router.get("/summary",authorize(['admin', 'superAdmin', 'inspector']), reportsSummary)


export default router