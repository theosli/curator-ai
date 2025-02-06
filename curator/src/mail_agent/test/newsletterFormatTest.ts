import { curateAndGenerateNewsletter } from "../newsletterFormat";

const defaultLinks = [
    'https://www.fromjason.xyz/p/notebook/where-have-all-the-websites-gone/',
    'https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/',
    'https://biomejs.dev/blog/biome-v1-5/',
    'https://birtles.blog/2024/01/06/weird-things-engineers-believe-about-development/',
    'https://julesblom.com/writing/flushsync',
];
const defaultInterests = ['react', 'ai'];

(async () => {
    const { markdown, html } = await curateAndGenerateNewsletter(defaultLinks, defaultInterests);

    console.log('Here is the current result :');
    console.log(markdown);
})();
