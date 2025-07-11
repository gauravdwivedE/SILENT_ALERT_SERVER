import reportUtils from '../models/report.model.js'
const { validateReport, reportModel } = reportUtils
import { createLog } from '../controllers/log.controller.js';
import cloudinary from '../config/cloudinary.js';

export const createReport = async (req, res) => {
    try {
        const user = req.user._id
        let { type, description, location } = req.body
        location = JSON.parse(location)
        
        const mediaFiles = req.files
        const cloudinaryUrls = []

        const error = validateReport({ type, description, user })
        if (error) return res.status(400).json(error)


        for (let key in mediaFiles) {
            const result = await cloudinary.uploader.upload(mediaFiles[key].tempFilePath)
            cloudinaryUrls.push(result.secure_url)
        }

        const report = await reportModel.create({ user, type, description, location, media: cloudinaryUrls })

        res.status(201).json({
            message: "report created",
            data: report
        })


    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const updateReport = async (req, res) => {
    try {
        // const userId = req.user
        const userId = req.user._id
        const reportId = req.params.id

        const { type, description, location } = req.body

        const error = validateReport({ type, description, user:userId })
        if (error) return res.status(400).json(error)

        let report = await reportModel.findOne({ user: userId, _id: reportId })
        if (!report) return res.status(404).json({ error: "report not found" })

        report.type = type;
        report.description = description;
        report.location = location;

        report = await report.save()

        res.status(200).json({
            message: "report updated",
            data: report
        })

    } catch (err) {
        res.status(500).json(err)
        console.log(err.message);
        
    }
}

export const deleteReport = async (req, res) => {
    try {
        const user = req.user._id
        const reportId = req.params.id

        const report = await reportModel.findOne({ user, _id: reportId })
        if (!report) return res.status(404).json({ error: "report not found" })

        report.isActive = false;

        await report.save()

        res.status(200).json({
            message: "report deleted",
        })

    } catch (err) {
        res.status(500).json(err)

    }
}

export const getUserReports = async (req, res) => {
    try {

        const user = req.user._id

        const reports = await reportModel.find({ user, isActive: true }).sort({createdAt: -1})
        if (!reports.length) return res.status(404).json({ error: "reports not found" })

        res.status(200).json({
            message: "reports fetched successfully",
            data: reports
        })

    } catch (err) {
        res.status(500).json(err)

    }
}

export const getAllReports = async (req, res) => {
    try {

        const reports = await reportModel.find({ isActive: true }).populate({path : 'user', select : '-password'}).sort({createdAt : -1})
        if (!reports.length) return res.status(404).json({ error: "report not found" })

        res.status(200).json({
            message: "reports fetched successfully",
            data: reports
        })

    } catch (err) {
        res.status(500).json(err.message)

    }
}

export const updateReportStatus = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const reportId = req.params.id
        const { status } = req.body

        const report = await reportModel.findByIdAndUpdate(reportId, { status })
        if (!report) return res.status(404).json({ error: "report not found" })

        let logDescription = `updated the report status as ${status}, report id: ${reportId}`
        createLog(loggedInUserId, logDescription)
    
        res.status(200).json({
            message: "report status updated",
        })

    } catch (err) {
        res.status(500).json(err)
        console.log(err);

    }
}

export const reportsSummary = async (req, res) => {
    try {

        const counts = await reportModel.aggregate([
            {
                $match: { isActive: true } // optional, depending on your needs
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const summary = {
            totalReports: 0,
            resolved: 0,
            accepted: 0,
            investigating: 0,
            rejected: 0,
            pending: 0
        };

        counts.forEach(item => {
            summary.totalReports += item.count;
            summary[`${item._id}`] = item.count;
        });

        res.status(200).json({
            summary,
        })

    } catch (err) {
        res.status(500).json(err)
        console.log(err);

    }
}
