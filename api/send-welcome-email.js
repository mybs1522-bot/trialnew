export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { studentEmail, studentName, portalUrl } = req.body || {};
    const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || '';

    if (!resendApiKey) {
      console.warn('[Email Server] RESEND_API_KEY missing in environment variables.');
      return res.status(400).json({ error: 'RESEND_API_KEY environment variable is not configured.' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL ? `Avada Design <${process.env.FROM_EMAIL}>` : 'Avada Design <hello@avada.space>',
        to: [studentEmail],
        subject: '🚀 Your 3-Day Free Trial is Active! Access Your Course Library',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; }
                .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e4e4e7; }
                .header { background: #18181b; color: #ffffff; padding: 32px 24px; text-align: center; }
                .badge { display: inline-block; background: rgba(16, 185, 129, 0.2); color: #10b981; font-weight: bold; font-size: 11px; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
                .content { padding: 32px 24px; color: #27272a; line-height: 1.6; }
                .button { display: block; width: 100%; max-width: 300px; margin: 24px auto; background: #059669; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 16px 24px; border-radius: 12px; text-align: center; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4); }
                .footer { background: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <div class="badge">3-DAY FREE TRIAL ACTIVATED</div>
                  <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Welcome to Avada Design</h1>
                  <p style="margin: 6px 0 0; color: #a1a1aa; font-size: 13px;">Your 3D Architectural Masterclass Library is Ready</p>
                </div>
                
                <div class="content">
                  <p style="font-size: 16px; font-weight: 600;">Hi ${studentName || 'Student'},</p>
                  <p>Your <strong>3-Day Free Trial</strong> has been successfully activated! You now have full HD streaming access to all course masterclasses.</p>

                  <a href="${portalUrl || 'http://localhost:4002/portal'}" class="button">Log In To Student Portal &rarr;</a>

                  <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin-top: 24px;">
                    <strong style="color: #065f46; font-size: 13px;">🔒 Access Details:</strong>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #047857;">
                      Login Email: <strong>${studentEmail}</strong><br/>
                      Trial Duration: <strong>72 Hours (Free Trial)</strong>
                    </p>
                  </div>
                </div>

                <div class="footer">
                  Need help? Contact support at <a href="mailto:support@avada.com" style="color: #059669;">support@avada.com</a><br/>
                  © ${new Date().getFullYear()} Avada Design. All rights reserved.
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(response.status).json({ error: data });
    }
  } catch (err) {
    console.error('Error sending welcome email:', err);
    return res.status(500).json({ error: err.message });
  }
}
