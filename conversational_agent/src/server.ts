import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { buildResponse } from './buildEmail';
import { sendMail } from './sendEmail';

// Load environment variables from the .env file
dotenv.config({ path: './../.env' });

const app = express();
const PORT = 3000;

// Middleware to parse requests as JSON
app.use(express.json());

// Webhook to receive incoming emails
app.post('/webhook', async (req: Request, res: Response) => {
    res.status(200).send('Webhook received');

    const body = req.body;
    const isSpam = req.headers['X-Spam-Status'];

    if (isSpam) {
        console.log('Spam received from ' + body['From']);
        return;
    }
    console.log(
        `Received email from ${body['From']} on ${body['Date']} : 
${body['TextBody']}`
    );

    const response = await buildResponse(body);

    // Send a reply email with the content generated by OpenAI
    await sendMail(body['From'], body['Subject'], response);
});

// Start the server
app.listen(PORT);
