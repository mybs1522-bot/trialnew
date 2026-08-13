/**
 * Resend Email Service Helper for Student Portal Access & Trial Welcome Emails
 */

export const sendStudentWelcomeEmail = async ({
  studentEmail,
  studentName,
  portalUrl = `${window.location.origin}/portal`,
}: {
  studentEmail: string;
  studentName: string;
  portalUrl?: string;
}) => {
  try {
    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentEmail,
        studentName,
        portalUrl,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Welcome email dispatched via /api/send-welcome-email:', data);
      return { success: true, data };
    } else {
      console.warn('Welcome email endpoint error:', data);
      return { success: false, error: data };
    }
  } catch (err) {
    console.error('Failed to trigger send-welcome-email API:', err);
    return { success: false, error: err };
  }
};
