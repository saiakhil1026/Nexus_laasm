import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { buildSystemPrompt, recallCustomerMemory, generateScriptedResponse } from './src/lib/hindsightEngine.ts';
import { Customer } from './src/types/support.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Gemini client if API key is provided
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { customer, prompt, stage, memoryEnabled } = req.body as {
      customer: Customer;
      prompt: string;
      stage: 1 | 2 | 3;
      memoryEnabled: boolean;
    };

    if (!customer || !prompt) {
      return res.status(400).json({ error: 'Customer and prompt are required' });
    }

    // Run Hindsight Memory Recall
    const recallContext = recallCustomerMemory(customer, prompt, memoryEnabled);

    // If Gemini API is available and enabled, generate dynamic response
    let responseText = '';
    let escalationNotice = undefined;

    if (ai) {
      try {
        const systemPrompt = memoryEnabled
          ? buildSystemPrompt(customer, recallContext)
          : `You are a standard Tier-1 Customer Support Bot with NO MEMORY of past tickets or prior interactions.
             You have no record of previous conversations with ${customer.name}.
             Ask standard introductory triage questions (account verification, reboot steps, light colors).
             Even if the customer complains that this happened before, you do not have access to their history, so ask them to describe the problem and advise them to restart their equipment.`;

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          },
        });

        responseText = geminiResponse.text || '';
        
        // If chronic stage 3 and memory enabled, attach escalation notice
        if (memoryEnabled && recallContext.isChronic) {
          escalationNotice = {
            ticketNumber: 'ENG-9042',
            tier: 'Tier 2 Senior Engineering',
            actionTaken: 'Autonomous Dispatch & Field Diagnostics Assigned',
            compensation: '$25 Courtesy Account Credit applied',
          };
        }
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to Hindsight precision script:', err?.message);
        // Fallback to high-precision scripted response
        const fallback = generateScriptedResponse(customer, stage || 1, prompt);
        responseText = fallback.text;
        escalationNotice = fallback.escalationNotice;
      }
    } else {
      // Precision scripted response when no key
      const fallback = generateScriptedResponse(customer, stage || 1, prompt);
      responseText = fallback.text;
      escalationNotice = fallback.escalationNotice;
    }

    return res.json({
      reply: responseText,
      recallContext,
      escalationNotice,
      usedAI: Boolean(ai),
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hindsight Support Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
