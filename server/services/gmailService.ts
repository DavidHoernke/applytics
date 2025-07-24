import { google } from 'googleapis';
import { isJobEmail } from '../utils/EmailClassifier';
import { ParsedEmail } from '../types/Email';
import prisma from '../prisma';

export async function fetchJobEmails(token: string, userId: string): Promise<ParsedEmail[]> {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  const gmail = google.gmail({ version: 'v1', auth });

const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { lastSyncedAt: true },
});

  let messagesRes;
  if (user?.lastSyncedAt) {
    console.log("Last synced at:", user.lastSyncedAt);
    const after = Math.floor(user.lastSyncedAt.getTime() / 1000);
    messagesRes = await gmail.users.messages.list({
      userId: 'me',
      q: `after:${after}`,
    });
  } else {
    console.log("First-time sync!");
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const after = Math.floor(oneMonthAgo.getTime() / 1000);

    messagesRes = await gmail.users.messages.list({
      userId: 'me',
      q: `after:${after}`,
      maxResults: 50,
    });
  }


  const messageIds = messagesRes.data.messages?.map(m => m.id) || [];

  const messageDetails = await Promise.all(
    messageIds.map(id =>
      gmail.users.messages.get({ userId: 'me', id: id! })
    )
  );

  const parsedMessages: ParsedEmail[] = messageDetails.map(msg => {
    const headers = msg.data.payload?.headers || [];
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const from = headers.find(h => h.name === 'From')?.value || '';
    const snippet = msg.data.snippet || '';
    const internalDate = msg.data.internalDate || '';

    return {
      id: msg.data.id!,
      subject,
      from,
      snippet,
      internalDate,
      isJobRelated: isJobEmail(subject, from, snippet),
    };
  });

  return parsedMessages.filter(msg => msg.isJobRelated);
}

