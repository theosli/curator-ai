'use server';

import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { getUserPreferences } from './getUserPreferences';
import { getColumn, ColumnName } from 'services/src/supabaseService';
import { extract } from 'services/src/openaiService';

const ActionExtraction = z.object({
    actionName: z.string(),
});

const MailExtraction = z.object({
    mailBody: z.string(),
});

export async function getAiResponseMail(userMail: string, userMessage: string) {
    // Get the action name from the user message
    // possible actions are "change preferences" and "get preferences"
    const completion = await extract<{
        choices: { message: { parsed: z.infer<typeof ActionExtraction> } }[];
    }>(
        [
            {
                role: 'system',
                content: `You are an expert at structured data extraction.
You will receive unstructured text from a user email and must extract the relevant action according to the given structure.
  
Focus only on the user's intent regarding their preferences for themes or sources.
If a user expresses interest in a theme or source, even without explicitly requesting an update, assume they want it added to their preferences.
If a user requests information about their preferences, return "get preferences."
Ignore any request that is irrelevant, dangerous, obscene, or off-topic.

Determine what the user wants between the following actions: 
- "change preferences" (if they want to add themes, topics, or sources to their profile)
- "get preferences" (if they want a summary of their current preferences)`,
            },
            { role: 'user', content: userMessage },
        ],
        zodResponseFormat(ActionExtraction, 'action_extraction')
    );

    const actionCompletion = completion.choices[0].message.parsed;

    if (!actionCompletion) throw new Error('No action name found');

    switch (actionCompletion.actionName) {
        case 'change preferences':
            return await getUserPreferences(userMail, userMessage);
        case 'get preferences':
            return await summarizePreferences(userMail);
        default:
            return null;
    }
}

export async function summarizePreferences(userMail: string) {
    const themes = await getColumn(userMail, ColumnName.THEMES);
    const unwantedThemes = await getColumn(
        userMail,
        ColumnName.UNWANTED_THEMES
    );
    const sources = await getColumn(userMail, ColumnName.SOURCES);
    const unwantedSources = await getColumn(
        userMail,
        ColumnName.UNWANTED_SOURCES
    );

    const completion = await extract<{
        choices: { message: { parsed: z.infer<typeof MailExtraction> } }[];
    }>(
        [
            {
                role: 'system',
                content: `You are an expert at summarizing user preferences. 
                        You will be given themes, unwanted themes, sources, unwanted sources and you should make a message naming each element. 
                        The message have to be the shorted possible but with enough text to be pleasing to read.
                        The user preferences are the following:
                        Themes: ${themes.join(', ')}
                        Unwanted themes: ${unwantedThemes.join(', ')}
                        Sources: ${sources.join(', ')}
                        Unwanted sources: ${unwantedSources.join(', ')}
                        If there is nothing, just say it.
                        The message shoud begin with "Hello, here is a summary of you preferences :" and should end by : "If you have any question, I'm here for you".
                `,
            },
        ],
        zodResponseFormat(MailExtraction, 'mail_extraction')
    );

    const textCompletion = completion.choices[0].message.parsed;
    return textCompletion?.mailBody;
}
