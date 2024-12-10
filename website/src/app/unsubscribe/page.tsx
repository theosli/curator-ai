'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);


const UnsubscribePage = () => {
  // State to save the token
  const [user, setUser] = useState<any>(null); 
  const [error, setError] = useState<string | null>(null);

  // Extract token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      fetchUserByToken(tokenParam);
    }
  }, []);

  // Fetch user based on the token
  const fetchUserByToken = async (token: string) => {
    try {
      // fetch user from db
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('unsubscribe_token', token)
        .single();

        console.log(data)
      if (error) {
        throw error;
      }
      // Update the user state if user found in db
      setUser(data);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Unable to retrieve user information.');
    }
  };

  // Unsubscribe user based on the token
  useEffect(() => {
    if (user) {
      unsubscribeUser(user.id).then(() => {

      }).catch(error => {
        console.error('Error during unsubscription:', error);
        setError('Error during unsubscription. Please try again later.');
      });
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Unsubscription</h1>
        {error ? (
          <p className="text-center text-red-600 mb-6">{error}</p>
        ) : (
          user ? (
            <p className="text-center text-green-600 mb-6">{user.user_email} successfully unsubscribed</p>
          ) : (
            <p className="text-center text-gray-600 mb-6">It should take a second...</p>
          )
        )}
      </div>
    </div>
  );
};

// Function to unsubscribe the user on Supabase
async function unsubscribeUser(userId: string) {
  const { error } = await supabase
    .from('subscribers')
    .update({ is_unsubscribed: true })
    .eq('id', userId);

  if (error) {
    throw new Error('Error during unsubscription');
  }
}

export default UnsubscribePage;
