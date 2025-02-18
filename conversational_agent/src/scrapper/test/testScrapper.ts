import { getUserPreferences } from '../getUserPreferences';
import { promises as fs } from 'fs';

async function getStringFromFile(filePath: string): Promise<string> {
    try {
        const data = await fs.readFile(filePath, 'utf-8'); // Read file as string
        return data;
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

(async () => {
    const userMessage = await getStringFromFile(__dirname + '/myMessage.txt');

    // Generate a response from AI based on the received email text
    const aiResponse = await getUserPreferences('test@mail.net', userMessage);

    console.log(aiResponse);
})();
