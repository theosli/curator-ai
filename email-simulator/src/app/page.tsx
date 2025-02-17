'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { buildResponse } from 'conversational_agent/src/sendEmail';
import { MailBody } from 'conversational_agent/src/types';

type Message = {
    sender: 'user' | 'system';
    content: string;
};

export default function EmailSimulator() {
    const [userMessage, setUserMessage] = useState('');
    const [conversation, setConversation] = useState<Message[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userMessage.trim() === '') return;

        // Add user message to conversation
        setConversation(prev => [
            ...prev,
            { sender: 'user', content: userMessage },
        ]);

        const body: MailBody = {
            From: 'test@mail.net',
            Subject: 'exchange',
            Date: Date.now().toString(),
            TextBody: userMessage,
            To: 'user',
        };
        // Generate and add system response
        buildResponse(body).then(systemResponse => {
            setConversation(prev => [
                ...prev,
                { sender: 'system', content: systemResponse },
            ]);
        });

        setUserMessage('');
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Email Simulator</h1>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 h-96 overflow-y-auto">
                {conversation.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                    >
                        <span
                            className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                        >
                            {message.content}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="text"
                    value={userMessage}
                    onChange={e => setUserMessage(e.target.value)}
                    placeholder="Type your message here"
                    className="flex-grow"
                />
                <Button type="submit">Send</Button>
            </form>
        </div>
    );
}
