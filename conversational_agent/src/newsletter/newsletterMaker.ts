'use server';

import {
    runNewsletter,
    runNewsletterWithEmail,
} from './newsletterScript';
import { ColumnName, getColumn } from '../supabaseService';
import { createClient } from '@supabase/supabase-js';

const loggingActivated = true;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('❌ Missing Supabase credentials.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getPendingNewsletters() {
    const currentISO = new Date().toISOString();
    const { data, error } = await supabase
        .from('subscribers')
        .select('id, user_email, next_newsletter, periodicity')
        .lte('next_newsletter', currentISO);

    if (error) {
        console.error('❌ Error fetching pending newsletters:', error);
        return [];
    }
    return data;
}

export async function updateNextNewsletter(
    userId: number,
    periodicity: number
) {
    const newNewsletterTimestampSeconds =
        Math.floor(Date.now() / 1000) + periodicity;
    const newNewsletterISO = new Date(
        newNewsletterTimestampSeconds * 1000
    ).toISOString();

    const { error } = await supabase
        .from('subscribers')
        .update({ next_newsletter: newNewsletterISO })
        .eq('id', userId);

    if (error) {
        console.error(
            `❌ Error updating next newsletter for user ID ${userId}:`,
            error
        );
    } else if (loggingActivated) {
        console.log(
            `📅 Next newsletter for user ID ${userId} scheduled at ${newNewsletterISO}`
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
