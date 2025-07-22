export interface ParsedEmail {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  internalDate: string;
  isJobRelated: boolean;
}
