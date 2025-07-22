import { Router } from 'express';
import { fetchJobEmails } from '../services/gmailService';

const router = Router();

router.post('/import', async (req, res) => {
  const token = req.body.token;
  console.log('[IMPORT] Received token:', token);

  if (!token) {
    console.log('[IMPORT] ❌ Missing token');
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const emails = await fetchJobEmails(token);
    console.log('[IMPORT] ✅ Parsed emails:', emails);
    return res.json({ emails });
  } catch (err) {
    console.error('[IMPORT] ❌ Error in fetchJobEmails:', err);
    return res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

export default router;
