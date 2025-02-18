'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import EmailSimulator from '@/components/emailSimulator';
import NewsletterExample from '@/components/newsletter';

const Page = () => {
    const [page, setPage] = useState<'emailSimulator' | 'newsletter'>(
        'emailSimulator'
    ); // Track current page

    // Helper function to add an active class to the button
    const buttonClass = (isActive: boolean) =>
        `px-4 py-2 rounded-md text-sm font-medium focus:outline-none 
        ${
            isActive
                ? 'text-white bg-transparent'
                : 'bg-blue-600 text-white hover:bg-gray-300 hover:text-black focus:bg-gray-300 focus:text-white active:bg-transparent'
        }`;

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Buttons to switch between pages */}
            <div className="mb-4 flex gap-4">
                <Button
                    className={buttonClass(page === 'emailSimulator')}
                    onClick={() => setPage('emailSimulator')}
                >
                    Email Simulator
                </Button>
                <Button
                    className={buttonClass(page === 'newsletter')}
                    onClick={() => setPage('newsletter')}
                >
                    Generate Custom Newsletter
                </Button>
            </div>

            {/* Conditionally render based on current page */}
            {page === 'emailSimulator' && <EmailSimulator />}
            {page === 'newsletter' && <NewsletterExample />}
        </div>
    );
};

export default Page;
