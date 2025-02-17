import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { sendNewsletter } from 'conversational_agent/src/newsletterMaker';

// Example Newsletter component (you can customize it with your custom function)
const NewsletterExample = () => {
    const [newsletter, setNewsletter] = useState('');
    const [isGeneratingResponse, setIsGeneratingResponse] = useState(false); // To track if response is being generated

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setIsGeneratingResponse(true); // Start showing the loading animation

        // Generate and add system response
        sendNewsletter('test@mail.net').then(systemResponse => {
            setIsGeneratingResponse(false); // Stop the loading animation
            setNewsletter(systemResponse.html);
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Generate Custom Newsletter
            </h1>
            <div className="bg-gray-100 p-4 rounded-lg mb-4 h-96 overflow-y-auto">
                <div
                    className={`inline-block p-2 rounded-lg bg-white text-black`}
                    dangerouslySetInnerHTML={{
                        __html: newsletter.replace(/\n/g, '<br />'),
                    }}
                />
                {isGeneratingResponse && (
                    <div className="text-center mt-4">
                        <span className="loading-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </span>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Button
                    className="bg-blue-600 text-white hover:bg-gray-300 hover:text-black focus:outline-none focus:ring-2 active:bg-blue-600"
                    type="submit"
                >
                    Generate
                </Button>
            </form>
        </div>
    );
};

export default NewsletterExample;
