import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import {
    ChatCompletionMessageParam,
    ResponseFormatJSONSchema,
} from 'openai/resources';

dotenv.config({ path: './../.env' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export const extract = async <T>(
    messages: {
        role: string;
        content: string;
        name?: string;
    }[],
    response_format: ResponseFormatJSONSchema
): Promise<T> => {
    // Convert messages to OpenAI's expected type
    const formattedMessages: ChatCompletionMessageParam[] = messages.map(
        msg => {
            if (msg.role === 'function') {
                return {
                    role: 'function',
                    content: msg.content,
                    name: msg.name || 'default_function',
                } as ChatCompletionMessageParam;
            }
            return {
                role: msg.role as 'system' | 'user' | 'assistant',
                content: msg.content,
            };
        }
    );

    return openai.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        response_format: response_format,
    }) as unknown as T;
};
