const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Configure multer for file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            cb(null, true);
        } else {
            cb(new Error("Unsupported file type! Only PDF and DOCX are allowed."), false);
        }
    }
});

// --- Analysis Endpoint ---
router.post('/analyze', authMiddleware, upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Resume file is required.' });
    }

    const { jobDescription } = req.body;
    if (!jobDescription) {
        return res.status(400).json({ message: 'Job description is required.' });
    }

    let resumeText = '';
    try {
        // Extract text from the uploaded file buffer
        if (req.file.mimetype === "application/pdf") {
            const data = await pdfParse(req.file.buffer);
            resumeText = data.text;
        } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const { value } = await mammoth.extractRawText({ buffer: req.file.buffer });
            resumeText = value;
        }

        // --- AI Analysis using Gemini ---
        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const prompt = `
            Analyze the following resume text against the provided job description.
            Provide your analysis in a valid JSON format with three keys:
            1. "extractedSkills": An array of strings representing key skills from the resume relevant to the job.
            2. "matchScore": A percentage score (a number from 0 to 100) representing how well the resume matches the job description, based on experience, skills, and overall fit.
            3. "improvementSuggestions": An array of strings with actionable suggestions for the candidate to improve their resume for this specific job.

            ---
            Resume Text:
            ${resumeText.substring(0, 8000)}
            ---
            Job Description:
            ${jobDescription.substring(0, 8000)}
            ---
        `;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
        };

        const { data } = await axios.post(apiUrl, payload);
        
        let aiResponse;
        try {
            // The response text might be wrapped in markdown JSON format.
            const rawText = data.candidates[0].content.parts[0].text;
            const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            aiResponse = JSON.parse(jsonText);
        } catch (parseError) {
             console.error("Error parsing AI response:", parseError);
             return res.status(500).json({ message: 'Error parsing AI analysis. Please try again.' });
        }

        res.json({
            aiAnalysis: aiResponse
        });

    } catch (error) {
        console.error('Analysis error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'An error occurred during analysis.' });
    }
});

module.exports = router;

