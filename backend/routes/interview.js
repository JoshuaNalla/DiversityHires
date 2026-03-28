const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const fetch = require('cross-fetch');

const router = express.Router();

// Helper to generate speech using ElevenLabs
async function generateSpeech(text) {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  
  if (!process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
      console.warn("Missing ElevenLabs API Key, returning dummy audio.");
      return null;
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5
      }
    })
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}

// Start the interview and ask the first question
router.post('/start-interview', async (req, res) => {
  try {
    const { summary } = req.body;
    
    if (!summary) return res.status(400).json({ error: 'Missing resume summary' });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Generate the first interview question
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an AI interviewer starting a technical interview.
Based on this candidate summary: ${JSON.stringify(summary)}
Generate a brief, welcoming opening statement and ONE initial technical question to ask them about their experience. Keep it conversational.`
    });

    const questionText = response.text;
    const audioBase64 = await generateSpeech(questionText);

    return res.json({ 
        success: true, 
        question: questionText,
        audio: audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : null
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    return res.status(500).json({ error: 'Failed to generate interview question.' });
  }
});

// Continue the interview loop
router.post('/next-question', async (req, res) => {
  try {
      const { summary, history } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an AI interviewer. 
Candidate Summary: ${JSON.stringify(summary)}
Chat History: ${JSON.stringify(history)}

Generate a thoughtful response to their last answer, and then ask ONE follow-up question. Keep it concise, natural, and conversational.`
      });

      const questionText = response.text;
      const audioBase64 = await generateSpeech(questionText);

      return res.json({ 
          success: true, 
          question: questionText,
          audio: audioBase64 ? `data:audio/mpeg;base64,${audioBase64}` : null
      });
  } catch (error) {
      console.error('Error in interview loop:', error);
      return res.status(500).json({ error: 'Failed to generate next question.' });
  }
});

module.exports = router;
