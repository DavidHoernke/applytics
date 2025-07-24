import { google } from 'googleapis';
import prisma from '../prisma';

export async function authorizeUser(token: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });

  const gmail = google.gmail({ version: 'v1', auth });

  const userProfile = await gmail.users.getProfile({ userId: 'me' });

  const email = userProfile.data.emailAddress!;
  const name = email.split('@')[0];

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      lastSyncedAt: null, // optional, but explicit
    },
  });
    console.log('[AUTH] User authorized:', user);
  return user;
}
