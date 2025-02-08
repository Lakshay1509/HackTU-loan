
"use client"


import { CheckCircle, XCircle } from "lucide-react"


interface ResultDisplayProps {
  probability: number | undefined;
  result: "Approved" | "Rejected" | undefined;
}

const ResultDisplay = ({probability , result} : ResultDisplayProps) => {

    const isApproved = result === "Approved"
  const bgColor = isApproved ? "bg-green-50" : "bg-red-50"
  const textColor = isApproved ? "text-green-700" : "text-red-700"
  const borderColor = isApproved ? "border-green-200" : "border-red-200"
  const Icon = isApproved ? CheckCircle : XCircle


    if (!result) {
        return 
      }
    
  return (

    <div className="flex justify-center items-center">

    <div className="p-4 w-[60%]">
      <div className={`mt-4 p-6 ${bgColor} ${textColor} rounded-lg border ${borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon className="w-8 h-8 mr-2" />
            <span className="text-xl font-semibold">{result}</span>
          </div>
          <div >
          Chance of approval: <span className="font-semibold"> {probability?.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
};

export default ResultDisplay;
