'use client'

import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatHistoryProps {
    chatHistory: { type: string; message: string }[];

}

const ChatHistory = ({ chatHistory }:ChatHistoryProps) => {
  return (
    <>
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`flex items-start space-x-3 animate-fadeIn ${
            message.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.type === "bot" && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              G
            </div>
          )}
          <div
            className={`max-w-[80%] py-3 px-4 rounded-2xl my-2 shadow-md ${
              message.type === "user"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <div className={message.type === "user" ? "prose prose-invert" : "prose"}>
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </div>
          </div>
          {message.type === "user" && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ChatHistory;