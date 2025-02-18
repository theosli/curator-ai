'use server';

import dotenv from 'dotenv';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { ServerClient } from 'postmark';
import { MailBody } from './types';
import { getAiResponseMail } from './scrapper/switchActions';

// Load environment variables from the .env file
dotenv.config({ path: './../.env' });

export const sendMail = async (body: MailBody) => {
    // Use the Postmark API key from environment variables
    const client = new ServerClient(process.env.POSTMARK_API_KEY || '');
    try {
        const formattedBody = await buildResponse(body);
        // Send an email
        const result = await client.sendEmail({
            From: process.env.DEFAULT_POSTMARK_MAIL || '', // Replace with a verified email
            To: body['From'],
            Subject: 'Re: ' + body['Subject'],
            ReplyTo: body['To'],
            HtmlBody: formatHtmlBody(formattedBody),
            TextBody: formatTextBody(formattedBody),
            MessageStream: 'outbound',
        });
        console.error('E-Mail sent successfully : ', result);
    } catch (error) {
        console.error('Error when trying to send the E-Mail :', error);
    }
};

export const buildResponse = async (body: MailBody) => {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);

    // Generate a response from AI based on the received email text
    const aiResponseMail = await getAiResponseMail(
        body['From'],
        body['TextBody']
    );

    return `
        ${aiResponseMail}
        -------- Previous Message --------
        
        From: ${purify.sanitize(body['From'])}
        
        Sent: ${purify.sanitize(body['Date'])}
        
        To: ${purify.sanitize(body['To'])}
        
        Subject: ${purify.sanitize(body['Subject'])}
        
        ${purify.sanitize(body['TextBody'])}
    `;
};

/**
 * Formats the newsletter in Markdown
 * @param content String : The content of the mail
 * @returns String
 */
function formatTextBody(content: string) {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    return `Curator AI

    ${purify.sanitize(content)}
    
    See you soon for your next newsletter!`;
}

/**
 * Formats the newsletter in html with style
 * @param content String : The content of the mail
 * @returns String
 */
function formatHtmlBody(content: string) {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    return `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; padding: 20px; border-radius: 10px; max-width: 800px; margin: 0 auto;">
  <h1 style="color: #164e63; text-align: center; font-size: 32px;">Curator AI</h1>
  <p style="font-size: 18px; text-align: center;">Incoming message :</p>
  <div style="margin-bottom: 30px; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
  ${purify.sanitize(content).replace(/\n/g, '<br/>')}
  </div>
  <p style="font-size: 18px; text-align: center;">See you soon for your next newsletter!</p>
`;
}
