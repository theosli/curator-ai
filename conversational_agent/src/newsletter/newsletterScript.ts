import { sendEmail } from 'services/src/postmarkService';
import { curateAndGenerateNewsletter } from './newsletterFormat';

const defaultLinks = [
    'https://www.fromjason.xyz/p/notebook/where-have-all-the-websites-gone/',
    'https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/',
    'https://biomejs.dev/blog/biome-v1-5/',
    'https://birtles.blog/2024/01/06/weird-things-engineers-believe-about-development/',
    'https://julesblom.com/writing/flushsync',
];
const defaultInterests = ['react', 'ai'];

// Calls the curateAndGenerateNewsletter function with right parameters then sends the mail
// TODO : Add all the dynamic part (newsletter parameters, email params)

export async function runNewsletter(links: string[], interests: string[]) {
    const { markdown, html } = await curateAndGenerateNewsletter(
        links.length > 0 ? links : defaultLinks,
        interests.length > 0 ? interests : defaultInterests
    );

    return { markdown, html };
}

export async function runNewsletterWithEmail(
    email: string,
    links: string[],
    interests: string[]
) {
    const { markdown, html } = await runNewsletter(links, interests);

    sendEmail(
        {
            to: email,
            subject: 'Your weekly newsletter',
            htmlBody: html,
            textBody: markdown,
            messageStream: 'outbound',
        },
        true
    );

    console.log('Newsletter email sent');
}
