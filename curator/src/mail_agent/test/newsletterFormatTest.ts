import { curateAndGenerateNewsletter } from "../newsletterFormat";

(async () => {
    const { markdown, html } = await curateAndGenerateNewsletter('test@mail.net');

    console.log('Here is the current result :');
    console.log(markdown);
})();
