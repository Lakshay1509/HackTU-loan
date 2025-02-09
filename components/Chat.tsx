//@ts-nocheck

'use client'
import "regenerator-runtime/runtime";
import React, { useState, useRef , useEffect } from "react";
import ChatHistory from "@/components/ChatHistory";
import { Text } from "./Text";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

interface Props {
  transactions?: any[];
  user: string;
}

const Chat =  ({transactions,user}:Props) => {
  

  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { type: string; message: string }[]
  >([
    {
      type: "bot",
      message:
        `Hello ${user}! I'm AI Guru, your personal assistant. How can I help you today?`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [emiSum , setEmiSum] = useState(0)

  async function getEmiSum() {
    const response =  await axios.post('http://127.0.0.1:8000/get_emi_sip_sum', { 
      transactions: transactions
    },{
      headers: {
        "Content-Type": "application/json",
      },
  })
    return response.data.emi_sip_sum
  }

  useEffect(() => {
    const fetchEmiSum = async () => {
      try {
        const emiSumValue = await getEmiSum(); 
        setEmiSum(emiSumValue); 
        // console.log(emiSumValue); 
      } catch (error) {
        console.error("Error fetching EMI sum:", error);
      }
    };
  
    fetchEmiSum(); 
  }, [transactions]);
  

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Handle user input
  const handleUserInput = (e: any) => {
    setUserInput(e.target.value);
  };

  // Real-time transcript update
  useEffect(() => {
    if (isListening) {
      setUserInput(transcript);
    }
  }, [transcript, isListening]);

  const handleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      resetTranscript(); // Optionally reset the transcript after stopping
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsListening(!isListening);
  };

  const genAI = new GoogleGenerativeAI(
    "AIzaSyA0YRmZnI_qmAPrjGZfPLUemM0pJP9I1Pk"
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `You are a professional **Finance and Loan Advisor** specializing in personal finance management, investment strategies, and loan advisory. Your role is to analyze the user's financial situation, income, expenses, and goals to provide tailored advice on loan options, repayment strategies, and financial planning. You must offer clear, actionable recommendations that maximize savings, minimize risks, and ensure long-term financial stability. Avoid jargon and explain complex terms simply when necessary. Respond only to finance-related queries; politely decline and block any unrelated topics or inappropriate requests. Begin each response with a concise summary of the user's financial context and conclude with a well-defined roadmap for achieving their financial objectives.

    
    These are my current emi's and sip's ${emiSum} . Please answer any queries in context of this information. My name is ${user}.
    Please answer the queries in context of prevoius conversation. using this JSON


    ${JSON.stringify([chatHistory.map((item) => item.message)])}
    
    `
    ,
  });

  // Send message to Gemini API
  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <>
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="py-6 px-6 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-blue-500"
            >
              <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V8a1 1 0 011-1z" />
            </svg>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  AI Guru
                </span>
              </h1>
              <p className="text-gray-600 mt-1">
                Your intelligent assistant for smarter conversations
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8 overflow-auto">
        <ChatHistory chatHistory={chatHistory} />
        <div ref={chatEndRef} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white p-6 shadow-lg">
        <div className="container mx-auto flex gap-3 items-center">
          <input
            type="text"
            className="flex-grow px-6 py-3 rounded-full bg-gray-50 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="Type your message..."
            value={userInput}
            onChange={handleUserInput}
            disabled={isLoading}
          />

          {browserSupportsSpeechRecognition && (
            <button
              className={`p-3 rounded-full ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-black-1 hover:bg-gray-600"
              } transition-colors shadow-md`}
              onClick={handleListening}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          <button
            className="p-3 rounded-full bg-black-1 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            onClick={sendMessage}
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>

          <button
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-md"
            onClick={clearChat}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        
      </footer>
      
    </div>
  </>
  );
};

export default Chat;
