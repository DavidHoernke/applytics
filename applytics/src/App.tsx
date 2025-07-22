import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import type { ParsedEmail } from './types/Email';

function App() {
  const [emails, setEmails] = useState<ParsedEmail[]>([]);
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: 'implicit', // or 'auth-code' if you want to do refresh tokens later
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    onSuccess: async (tokenResponse) => {
      console.log('✅ Got access token:', tokenResponse.access_token);
      setLoading(true);

      try {
        const res = await axios.post('http://localhost:4000/import', {
          token: tokenResponse.access_token,
        });
        setEmails(res.data.emails);
      } catch (err) {
        console.error('❌ Error fetching emails:', err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.error('❌ Login failed');
    },
  });

  return (
    <div className="login-box">
      <h2>Welcome to Appalytics</h2>
      <button onClick={() => login()}>Sign in with Google</button>

      <div className="email-list">
        {loading && <p>Fetching emails...</p>}
        {emails.map((e) => (
          <div key={e.id}>
            <h4>{e.subject}</h4>
            <p>{e.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
