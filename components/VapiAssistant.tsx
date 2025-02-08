//@ts-nocheck

'use client';

import { useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';
import { Phone, PhoneOff } from 'lucide-react';

export default function VapiAssistant() {
  const [vapi, setVapi] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [error, setError] = useState(null);
  

  // Initialize Vapi
  useEffect(() => {
    const initializeVapi = async () => {
      try {
        const vapiInstance = new Vapi("fe781d65-156d-438c-a71e-a7b7d3ef0074");
        setVapi(vapiInstance);

        vapiInstance.on('call-start', () => setIsCallActive(true));
        vapiInstance.on('call-end', () => setIsCallActive(false));
        vapiInstance.on('error', (error) => {
          setError(error);
          setIsCallActive(false);
        });
      } catch (err) {
        setError(err);
      }
    };

    initializeVapi();
  }, []);

  const toggleCall = async () => {
    try {
      if (!isCallActive) {
        await vapi.start("9e646059-e4d3-41f4-b287-4b094f053eab");
      } else {
        await vapi.stop();
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <button
      onClick={toggleCall}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all ${
        isCallActive 
          ? 'bg-red-500 hover:bg-red-600' 
          : ' bg-black-1 hover:bg-gray-600'
      }`}
    >
      {isCallActive ? (
        <PhoneOff className="w-6 h-6 text-white" />
      ) : (
        <Phone className="w-6 h-6 text-white" />
      )}
    </button>
  );
}