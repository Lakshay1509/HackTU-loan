"use client"

import React, { useState, useEffect } from 'react'

import { CheckCircle2, XOctagon } from "lucide-react";

const steps = [
  "Verifying Aadhar",
  "Detecting face",
  "Verifying Aadhar number"
]

interface AadharAnimationProps {
  message: string | null;
}

export default function AadharAnimation({ message }: AadharAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isValid = message === "Valid Aadhaar Card Detected.";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  if(message ===null){
    return
  }

  if(message === "Verifying"){


  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-xl font-bold">Verification in Progress</h1>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-600">{steps[currentStep]}</p>
      </div>
    </div>
  );
    }
    
    return (
        <div className="flex items-center gap-4 p-6 rounded-xl bg-white transition-all duration-200 ">
      {isValid ? (
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      ) : (
        <XOctagon className="w-8 h-8 text-rose-500" />
      )}
      
      <p className={`font-medium ${
        isValid ? "text-emerald-700" : "text-rose-700"
      }`}>
        {message}
      </p>
    </div>
    )
}