import { Client } from 'postmark';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config({ path: './../.env' });

const postmarkApiToken = process.env.POSTMARK_API_KEY!;
const defaultSenderEmail = process.env.DEFAULT_POSTMARK_MAIL!;
const defaultInboundEmail = process.env.INBOUND_POSTMARK_MAIL!;
const client = new Client(postmarkApiToken);

export type EmailData = {
    from?: string;
    to?: string;
    replyTo?: string;
    subject: string;
    textBody?: string;
    htmlBody?: string;
    messageStream?: string;
};

export const sendEmail = async (
    emailData: EmailData,
    enableResponse: boolean
) => {
    // Sending Email via Postmark API
    try {
        const response = await client.sendEmail({
            From: emailData.from ?? defaultSenderEmail,
            To: emailData.to,
            ReplyTo:
                (emailData.replyTo ?? enableResponse)
                    ? defaultInboundEmail
                    : undefined,
            Subject: emailData.subject,
            TextBody: emailData.textBody,
            HtmlBody: emailData.htmlBody,
            MessageStream: emailData.messageStream,
        });

        if (response && response.ErrorCode) {
            console.log(`Postmark Error: ${response.Message}`);
            return { message: `Postmark Error`, hasError: true };
        }
        return { message: `Email sent successfully!`, hasError: false };
    } catch (error) {
        return { message: `Error sending email`, hasError: true };
    }
};
