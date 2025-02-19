'use server';

import { validateEmail } from '@/utils/validateEmail';
import {
  insertEmail,
  isEmailAlreadyRegistred,
} from 'services/src/supabaseService';

/**
 * Handles the logic for subscribing an email, including validation.
 * @param email - The email address to subscribe.
 */
export async function handleSubscription(
  email: string,
): Promise<{ message: string; hasError: boolean }> {
  if (!validateEmail(email)) {
    return { message: `Invalid email address.`, hasError: true };
  }

  let res = await isEmailAlreadyRegistred(email);

  if (res.hasError) {
    return res;
  }

  return insertEmail(email);
}
