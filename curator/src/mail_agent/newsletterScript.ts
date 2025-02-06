import { curateAndGenerateNewsletter } from './newsletterFormat';
import dotenv from 'dotenv';
import { ServerClient } from 'postmark';

dotenv.config({ path: './../.env' });

// Calls the curateAndGenerateNewsletter function with right parameters then sends the mail
// TODO : Add all the dynamic part (newsletter parameters, email params)

export async function runNewsletter(mail: string) {
    const { markdown, html } = await curateAndGenerateNewsletter(mail);
    if (!process.env.POSTMARK_API_KEY || !process.env.DEFAULT_POSTMARK_MAIL) {
        throw new Error(
            'Make sure to define POSTMARK_SERVER_API_KEY and POSTMARK_DEFAULT_MAIL if you want to send mail'
        );
    }

    // Sending email :
    const client = new ServerClient(process.env.POSTMARK_API_KEY as string);

    client.sendEmail({
        From: mail,
        To: mail,
        Subject: 'Your weekly newsletter',
        HtmlBody: html,
        TextBody: markdown,
        MessageStream: 'outbound',
    });

    console.log('Newsletter email sent');
}
