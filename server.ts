import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { requireAuth, type AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateUser,
  getUserHairPassports,
  saveUserHairPassport,
  getUserBookingRequests,
  saveUserBookingRequest,
} from './src/db/users.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Synchronize authenticated user profile and return saved passports & booking requests
  app.get('/api/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || 'guest@magdana.studio';
      const name = req.user?.name || null;

      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userRecord = await getOrCreateUser(uid, email, name);
      const [passports, bookings] = await Promise.all([
        getUserHairPassports(uid),
        getUserBookingRequests(uid),
      ]);

      return res.json({
        user: userRecord,
        passports,
        bookings,
      });
    } catch (error: unknown) {
      console.error('Failed to load user profile data:', error);
      const message = error instanceof Error ? error.message : 'Failed to load profile data';
      return res.status(500).json({ error: message });
    }
  });

  // Save a generated Hair Passport to Cloud SQL
  app.post('/api/passports', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || 'guest@magdana.studio';
      const name = req.user?.name || null;

      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        clientName,
        hairType,
        hairConcern,
        hairLength,
        salonRitual,
        careName,
        shampoo,
        treatmentMask,
        leaveInCare,
      } = req.body || {};

      if (!salonRitual || !careName) {
        return res.status(400).json({ error: 'Missing required hair passport fields' });
      }

      const saved = await saveUserHairPassport(uid, email, name, {
        clientName: String(clientName || name || 'Прекрасная гостья'),
        hairType: String(hairType || 'blonde'),
        hairConcern: String(hairConcern || 'yellow_dry'),
        hairLength: String(hairLength || 'medium'),
        salonRitual: String(salonRitual),
        careName: String(careName),
        shampoo: String(shampoo || ''),
        treatmentMask: String(treatmentMask || ''),
        leaveInCare: String(leaveInCare || ''),
      });

      return res.status(201).json({ passport: saved });
    } catch (error: unknown) {
      console.error('Failed to save hair passport:', error);
      const message = error instanceof Error ? error.message : 'Failed to save hair passport';
      return res.status(500).json({ error: message });
    }
  });

  // Save a booking request to Cloud SQL
  app.post('/api/bookings', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const email = req.user?.email || 'guest@magdana.studio';
      const name = req.user?.name || null;

      if (!uid) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { serviceTitle, serviceCategory, servicePrice, wearTime, contactChannel } = req.body || {};

      if (!serviceTitle) {
        return res.status(400).json({ error: 'Missing service title' });
      }

      const saved = await saveUserBookingRequest(uid, email, name, {
        serviceTitle: String(serviceTitle),
        serviceCategory: String(serviceCategory || 'Индивидуальный визит'),
        servicePrice: String(servicePrice || 'по консультации'),
        wearTime: wearTime ? String(wearTime) : null,
        contactChannel: String(contactChannel || 'Telegram'),
      });

      return res.status(201).json({ booking: saved });
    } catch (error: unknown) {
      console.error('Failed to save booking request:', error);
      const message = error instanceof Error ? error.message : 'Failed to save booking request';
      return res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
