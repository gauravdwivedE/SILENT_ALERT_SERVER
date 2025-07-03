import { Router } from 'express'
import { createReport, updateReport, deleteReport, updateReportStatus, getAllReports, getUserReports, reportsSummary } from '../controllers/report.controller.js'
import { authenticate, isAdmin } from '../middlewares/authentication.js'

const router = Router()

router.use(authenticate)

router.post("/", createReport)
router.put("/:id", updateReport)
router.delete("/:id", deleteReport)
router.patch("/:id/status", isAdmin, updateReportStatus)
router.get("/",  isAdmin, getAllReports)
router.get("/users", getUserReports)
router.get("/summary", isAdmin, reportsSummary)


export default router