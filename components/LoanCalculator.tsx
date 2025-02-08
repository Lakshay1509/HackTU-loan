"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoanCalculationResults } from './LoanCalculationResults'
import { LoanCategory } from "../types";


export default function LoanCalculator({ transactions }: { transactions?: any[] }) {

  
  

  const [amount, setAmount] = useState("");
  const [income, setIncome] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState<LoanCategory | "">("");
  const [result, setResult] = useState<string | null>(null);
  const [calculationResults, setCalculationResults] = useState<any>(null)

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple calculation for demonstration purposes
    const interestRate = 0.05; // 5% interest rate
    const principal = parseFloat(amount);
    const termInYears = parseFloat(year);

    if (isNaN(principal) || isNaN(termInYears)) {
      setResult("Please enter valid numbers for amount and year.");
      return;
    }

    const formattedData = {
      "salary": income,
      "loan_amount": amount,
      "tenure_months" : year,
      "annual_interest_rate": 10,
      "transactions" : transactions
    }

  

    const response = await axios.post('http://localhost:8000/calculate', formattedData,{
      headers: {
        "Content-Type": "application/json",
      },
   })

    console.log(response.data)
    setCalculationResults(response.data);
  };

  return (
    <div className="pb-8">
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold ">
          Loan Advisor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calc-amount">Amount</Label>
            <Input
              id="calc-amount"
              type="number"
              placeholder="Enter loan amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc-amount">Income</Label>
            <Input
              id="calc-amount"
              type="number"
              placeholder="Enter the income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              min="0"
              step="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc-year">Month</Label>
            <Input
              id="calc-year"
              type="number"
              placeholder="Enter loan term in months"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1"
              step="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc-category">Loan Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as LoanCategory)}
            >
              <SelectTrigger id="calc-category">
                <SelectValue placeholder="Select loan category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.values(LoanCategory).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full bg-gray-950 hover:bg-gray-700 text-white"
          >
            Calculate
          </Button>
        </form>
        {result && (
          <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
            {result}
          </div>
        )}
      </CardContent>
    </Card>

    {calculationResults && <LoanCalculationResults results={calculationResults} />}

    </div>
  );
}
