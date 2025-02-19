'use server';

import { generateWelcomeEmail } from '@/services/welcomeEmailContent';
import { sendEmail } from 'services/src/postmarkService';

/**
 * Handles the logic for sending a welcome email.
 * @param email - The recipient's email address.
 */
export async function handleSendWelcomeEmail(
  email: string,
  translations: { [key: string]: string },
): Promise<{ message: string; hasError: boolean }> {
  return await sendEmail(
    {
      to: email,
      subject: 'Welcome to CURATOR AI! 🚀',
      textBody: translations.txt,
      htmlBody: generateWelcomeEmail(translations),
    },
    true,
  );
}
