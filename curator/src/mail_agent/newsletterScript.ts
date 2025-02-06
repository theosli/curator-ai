import { curateAndGenerateNewsletter } from './newsletterFormat';
import dotenv from 'dotenv';
import { ServerClient } from 'postmark';

dotenv.config({ path: './../.env' });

const defaultLinks = [
    'https://www.fromjason.xyz/p/notebook/where-have-all-the-websites-gone/',
    'https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/',
    'https://biomejs.dev/blog/biome-v1-5/',
    'https://birtles.blog/2024/01/06/weird-things-engineers-believe-about-development/',
    'https://julesblom.com/writing/flushsync',
];
const defaultInterests = ['react', 'ai'];

const sendMail = false;

//runNewsletter("default@mail.com",defaultLinks, defaultInterests);


// Calls the curateAndGenerateNewsletter function with right parameters then sends the mail
// TODO : Add all the dynamic part (newsletter parameters, email params)

export async function runNewsletter(email:string, links: string[], interests: string[]) {
    const { markdown, html } = await curateAndGenerateNewsletter(links || defaultLinks, interests || defaultInterests);
    if (!process.env.POSTMARK_API_KEY || !process.env.DEFAULT_POSTMARK_MAIL) {
        throw new Error(
            'Make sure to define POSTMARK_SERVER_API_KEY and POSTMARK_DEFAULT_MAIL if you want to send mail'
        );
    }

    // Sending email :
    const client = new ServerClient(process.env.POSTMARK_API_KEY as string);

    client.sendEmail({
        From: mail,
        To: email,
        Subject: 'Your weekly newsletter',
        HtmlBody: html,
        TextBody: markdown,
        MessageStream: 'outbound',
    });

    console.log('Newsletter email sent');
}
