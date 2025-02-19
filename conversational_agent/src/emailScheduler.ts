'use server';

import cron from 'node-cron';
import {
    sendNewsletterWithEmail,
    setNextNewsletter,
} from './newsletter/newsletterMaker';
import { getPendingNewsletters } from 'services/src/supabaseService';

const loggingActivated = true;

// Main
console.log('🟢 Newsletter Scheduler started... Press CTRL + C to stop.');
cron.schedule('* * * * *', checkAndSendNewsletters);

async function checkAndSendNewsletters() {
    if (loggingActivated)
        console.log(
            '⏳ Checking for pending newsletters at',
            new Date().toISOString()
        );

    const pendingNewsletters = await getPendingNewsletters();
    if (!pendingNewsletters.length) {
        if (loggingActivated) console.log('✅ No newsletters to send.');
        return;
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    for (const subscriber of pendingNewsletters) {
        const { user_email, next_newsletter, periodicity } = subscriber;
        const newsletterTimestamp = Math.floor(
            new Date(next_newsletter).getTime() / 1000
        );

        if (newsletterTimestamp <= nowSeconds) {
            sendNewsletterWithEmail(user_email);
            await setNextNewsletter(user_email, periodicity);
        }
    }
}
