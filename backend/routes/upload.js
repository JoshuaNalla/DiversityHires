const express = require('express');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();
// Use memory storage for the hackathon MVP
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing or invalid.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Send the PDF securely to Gemini for parsing
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert technical recruiter analyzing this resume. Extract the candidate's core skills, top 3 achievements, and suggest 3 areas to probe during an interview. Return only valid JSON directly, without markdown blocks. Follow this structure: { "skills": [], "achievements": [], "probingAreas": [] }`
            },
            {
              inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype
              }
            }
          ]
        }
      ]
    });

    let rawText = response.text;
    if (rawText.startsWith('```json')) {
        rawText = rawText.substring(7, rawText.length - 3);
    }
    const summary = JSON.parse(rawText.trim());

    return res.json({ success: true, summary });
  } catch (error) {
    console.error('Error parsing resume:', error);
    return res.status(500).json({ error: 'Failed to parse resume.' });
  }
});

module.exports = router;
