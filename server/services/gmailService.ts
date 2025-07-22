import { google } from 'googleapis';
import { isJobEmail } from '../utils/EmailClassifier';
import { ParsedEmail } from '../types/Email';

export async function fetchJobEmails(token: string): Promise<ParsedEmail[]> {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });
  const gmail = google.gmail({ version: 'v1', auth });

  const messagesRes = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10,
  });

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
