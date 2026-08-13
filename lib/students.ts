import { supabase } from '../services/supabase';

/**
 * Register a new student in the database after successful Razorpay payment.
 * Uses upsert so if the same email+phone pays again, it refreshes their trial.
 */
export async function registerStudent(data: {
  email: string;
  phone?: string;
  name?: string;
  subscriptionId?: string;
}): Promise<boolean> {
  const emailClean = data.email.trim().toLowerCase();
  const phoneClean = (data.phone || '').trim();
  const nameClean = (data.name || emailClean.split('@')[0]).trim();

  const { error } = await supabase
    .from('students')
    .upsert(
      {
        email: emailClean,
        phone: phoneClean,
        name: nameClean,
        subscription_id: data.subscriptionId || null,
        trial_start: new Date().toISOString(),
        trial_active: true,
      },
      { onConflict: 'email' }
    );

  if (error) {
    // If onConflict email fails due to existing table constraint, retry without onConflict clause
    const { error: retryErr } = await supabase
      .from('students')
      .upsert({
        email: emailClean,
        phone: phoneClean,
        name: nameClean,
        subscription_id: data.subscriptionId || null,
        trial_start: new Date().toISOString(),
        trial_active: true,
      });

    if (retryErr) {
      console.error('Failed to register student in database:', retryErr);
      return false;
    }
  }
  return true;
}

/**
 * Verify a student's login by checking email (and optional phone) against the database.
 * Returns verification result with student data or error reason.
 */
export async function verifyStudentLogin(
  email: string,
  phone?: string
): Promise<{
  verified: boolean;
  student: { id: string; email: string; phone: string; name: string; trial_active: boolean; trial_start: string } | null;
  reason: string;
}> {
  let query = supabase
    .from('students')
    .select('*')
    .eq('email', email.trim().toLowerCase());

  if (phone && phone.trim()) {
    query = query.eq('phone', phone.trim());
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Student verification query failed:', error);
    return { verified: false, student: null, reason: 'Something went wrong. Please try again.' };
  }

  if (!data) {
    return {
      verified: false,
      student: null,
      reason: 'No account found with this email address. Please check your email or start a free trial first.',
    };
  }

  if (!data.trial_active) {
    return {
      verified: false,
      student: data,
      reason: 'Your subscription has been cancelled or expired. Please start a new trial.',
    };
  }

  return {
    verified: true,
    student: data,
    reason: 'Login successful',
  };
}
