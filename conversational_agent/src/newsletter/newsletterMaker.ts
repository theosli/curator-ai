'use server';

import { runNewsletter, runNewsletterWithEmail } from './newsletterScript';
import {
    ColumnName,
    getColumn,
    updateNextNewsletter,
} from 'services/src/supabaseService';

const loggingActivated = true;

export async function setNextNewsletter(email: string, periodicity: number) {
    const newNewsletterTimestampSeconds =
        Math.floor(Date.now() / 1000) + periodicity;
    const newNewsletterISO = new Date(
        newNewsletterTimestampSeconds * 1000
    ).toISOString();

    if (
        (await updateNextNewsletter(email, newNewsletterISO)) &&
        loggingActivated
    ) {
        console.log(
            `📅 Next newsletter for user ${email} scheduled at ${newNewsletterISO}`
        );
    }
}

export async function sendNewsletterWithEmail(userEmail: string) {
    if (loggingActivated)
        console.log(`📤 Sending newsletter to ${userEmail}...`);

    const themes = await getColumn(userEmail, ColumnName.THEMES);
    const sources = await getColumn(userEmail, ColumnName.SOURCES);

    runNewsletterWithEmail(userEmail, sources, themes);
}

export async function sendNewsletter(userEmail: string) {
    if (loggingActivated)
        console.log(`📤 Sending newsletter to ${userEmail}...`);

    const themes = await getColumn(userEmail, ColumnName.THEMES);
    const sources = await getColumn(userEmail, ColumnName.SOURCES);

    return await runNewsletter(sources, themes);
}
