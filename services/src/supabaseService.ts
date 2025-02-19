import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import _ from 'lodash';

// Load environment variables from the .env file
dotenv.config({ path: './../.env' });

// Initialize Supabase with environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export enum ColumnName {
    ID = 'id',
    USER_EMAIL = 'user_email',
    THEMES = 'themes',
    UNWANTED_THEMES = 'unwanted_themes',
    SOURCES = 'sources',
    UNWANTED_SOURCES = 'unwanted_sources',
    CREATED_AT = 'created_at',
    NEXT_NEWSLETTER = 'next_newsletter',
    PERIODICITY = 'periodicity',
}

// Retrieve the data for the subscribed email
export const getColumn = async (mail: string, columnName: ColumnName) => {
    const { data: data, error: error } = await supabase
        .from('subscribers')
        .select(columnName)
        .eq('user_email', mail)
        .single();

    if (error) {
        console.error(`Error retrieving ${columnName}: ${error.message}`);
    }

    return (data as Record<ColumnName, string[]>)[columnName] || [];
};

// Update the themes for the subscribed email
export const addPreferences = async (
    themes: string[],
    unwantedThemes: string[],
    sources: string[],
    unwantedSources: string[],
    mail: string
) => {
    const oldThemes = await getColumn(mail, ColumnName.THEMES);
    const oldUnwantedThemes = await getColumn(mail, ColumnName.UNWANTED_THEMES);
    const oldSources = await getColumn(mail, ColumnName.SOURCES);
    const oldUnwantedSources = await getColumn(
        mail,
        ColumnName.UNWANTED_SOURCES
    );

    const newThemes =
        _.union(_.difference(oldThemes || [], unwantedThemes), themes) || [];
    const newUnwantedThemes =
        _.union(
            _.difference(oldUnwantedThemes || [], themes),
            unwantedThemes
        ) || [];
    const newSources =
        _.union(_.difference(oldSources || [], unwantedSources), sources) || [];
    const newUnwantedSources =
        _.union(
            _.difference(oldUnwantedSources || [], sources),
            unwantedSources
        ) || [];

    const { error: updateError } = await supabase
        .from('subscribers')
        .update({
            themes: newThemes,
            unwanted_themes: newUnwantedThemes,
            sources: newSources,
            unwanted_sources: newUnwantedSources,
        })
        .eq('user_email', mail);

    if (updateError) {
        console.error(`Error updating preferences: ${updateError.message}`);
        return false;
    }
    return true;
};

export const isEmailAlreadyRegistred = async (email: String) => {
    try {
        const { data: existingEmail, error: selectError } = await supabase
            .from('subscribers')
            .select('user_email')
            .eq('user_email', email)
            .single();

        if (selectError && selectError.code !== 'PGRST116') {
            return {
                message: `Error verifying email ${selectError.code}: ${selectError.message}`,
                hasError: true,
            };
        }

        if (existingEmail) {
            return { message: `Email already registered.`, hasError: true };
        }

        return { message: ``, hasError: false };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { message: `Unexpected error occured`, hasError: true };
    }
};

export const insertEmail = async (email: String) => {
    try {
        const { error: insertError } = await supabase
            .from('subscribers')
            .insert([{ user_email: email }]);

        if (insertError) {
            console.error(`Error inserting email: ${insertError.message}`);
            return {
                message: `Error inserting email: ${insertError.message}`,
                hasError: true,
            };
        }

        return { message: `Email successfully registered.`, hasError: false };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { message: `Unexpected error occured`, hasError: true };
    }
};

export const updateNextNewsletter = async (email: string, newDate: string) => {
    const { error } = await supabase
        .from('subscribers')
        .update({ next_newsletter: newDate })
        .eq('user_email', email);

    if (error) {
        console.error(
            `Error updating next newsletter for user ${email}:`,
            error
        );
        return false;
    }
    return true;
};

export const getPendingNewsletters = async () => {
    const currentISO = new Date().toISOString();
    const { data, error } = await supabase
        .from('subscribers')
        .select('user_email, next_newsletter, periodicity')
        .lte('next_newsletter', currentISO);

    if (error) {
        console.error('❌ Error fetching pending newsletters:', error);
        return [];
    }
    return data;
};
