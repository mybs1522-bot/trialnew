import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 4000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        {
          name: 'stripe-dev-api',
          configureServer(server) {
            server.middlewares.use('/api/create-checkout-session', async (req, res) => {
              if (req.method === 'OPTIONS') {
                res.writeHead(200, {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'POST, OPTIONS',
                  'Access-Control-Allow-Headers': 'Content-Type',
                });
                res.end();
                return;
              }

              if (req.method !== 'POST') {
                res.writeHead(405, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Method not allowed' }));
                return;
              }

              let body = '';
              req.on('data', chunk => body += chunk);
              req.on('end', async () => {
                try {
                  const StripeModule = await import('stripe');
                  const Stripe = StripeModule.default;
                  const secretKey = env.STRIPE_SECRET_KEY || '';
                  const stripe = new Stripe(secretKey);

                  const payload = JSON.parse(body || '{}');
                  const {
                    product_name = 'Avada Architecture Pass',
                    monthly_price = 20,
                    trial_days = 3,
                    customer_name = '',
                    customer_email = '',
                    customer_phone = '',
                    origin = 'http://localhost:4000'
                  } = payload;

                  const amountInCents = Math.round(Number(monthly_price) * 100);

                  const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'subscription',
                    line_items: [
                      {
                        price_data: {
                          currency: 'usd',
                          product_data: {
                            name: product_name,
                            description: `3-Day Free Trial, then $${monthly_price}/month`,
                            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=80'],
                          },
                          unit_amount: amountInCents,
                          recurring: {
                            interval: 'month',
                          },
                        },
                        quantity: 1,
                      },
                    ],
                    subscription_data: {
                      trial_period_days: Number(trial_days),
                    },
                    customer_email: customer_email ? customer_email.trim() : undefined,
                    metadata: {
                      customer_name,
                      customer_email,
                      customer_phone
                    },
                    success_url: `${origin}/portal?session_id={CHECKOUT_SESSION_ID}&success=true`,
                    cancel_url: `${origin}/?canceled=true`,
                  });

                  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                  res.end(JSON.stringify({ url: session.url, sessionId: session.id }));
                } catch (e) {
                  console.error('Error in Vite Stripe dev server middleware:', e);
                  res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                  res.end(JSON.stringify({ error: e.message || 'Stripe error' }));
                }
              });
            });

            server.middlewares.use('/api/send-welcome-email', (req, res) => {
              if (req.method === 'OPTIONS') {
                res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' });
                res.end();
                return;
              }
              let body = '';
              req.on('data', chunk => { body += chunk.toString(); });
              req.on('end', async () => {
                try {
                  const payload = JSON.parse(body || '{}');
                  const { studentEmail, studentName, portalUrl } = payload;
                  const resendKey = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY;

                  if (!resendKey) {
                    console.log(`[Dev Server Email Notification] To: ${studentEmail} | Name: ${studentName || 'Student'} | Portal: ${portalUrl}`);
                    console.log(`[Dev Server Note] No RESEND_API_KEY found in .env file. Email dispatch simulated.`);
                    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                    res.end(JSON.stringify({ success: true, simulated: true, message: 'RESEND_API_KEY missing, logged to console.' }));
                    return;
                  }

                  const response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${resendKey}`,
                    },
                    body: JSON.stringify({
                      from: env.FROM_EMAIL ? `Avada Design <${env.FROM_EMAIL}>` : 'Avada Design <hello@avada.space>',
                      to: [studentEmail],
                      subject: '🚀 Your 3-Day Free Trial is Active! Access Your Course Library',
                      html: `
                        <!DOCTYPE html>
                        <html>
                          <body style="font-family: sans-serif; padding: 20px; background: #f4f4f5;">
                            <div style="max-width: 580px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px;">
                              <h2>Welcome to Avada Design Masterclasses!</h2>
                              <p>Hi ${studentName || 'Student'},</p>
                              <p>Your 3-Day Free Trial is active. You can log in using your email:</p>
                              <p><strong>Email:</strong> ${studentEmail}</p>
                              <p><a href="${portalUrl || 'http://localhost:4002/portal'}" style="display: inline-block; padding: 12px 24px; background: #059669; color: white; border-radius: 8px; text-decoration: none;">Log In To Student Portal</a></p>
                            </div>
                          </body>
                        </html>
                      `,
                    }),
                  });

                  const data = await response.json();
                  res.writeHead(response.status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                  res.end(JSON.stringify(data));
                } catch (err) {
                  console.error('Error sending welcome email in dev middleware:', err);
                  res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
            });
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
