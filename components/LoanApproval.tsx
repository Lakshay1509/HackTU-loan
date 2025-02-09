"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HowModelWorks from "./Pdf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResultDisplay from "./ResultDisplay";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import Markdown from "react-markdown";
import { Link, SquareArrowOutUpRightIcon } from "lucide-react";

interface result {
  result: "Approved" | "Rejected" | undefined;
  probability: number | undefined;
}

export default function LoanApplicationForm() {
  const { control, handleSubmit } = useForm();
  const [result, setResult] = React.useState<result | null>(null);
  const [aiSuggestion, setAiSuggestion] = React.useState<string>("");
  const [translate, setTranslate] = React.useState(false);

  function convertCurrencyStringToNumber(currencyString: string) {
    const numericString = currencyString.replace(/[^0-9.]/g, "");

    return numericString;
  }
  const toggleLanguage = () => setTranslate((prev) => !prev);

  const onSubmit = async (data: any) => {
    const formattedData = {
      no_of_dependents: data.no_of_dependents,
      income_annum: convertCurrencyStringToNumber(data.income_annum),
      loan_amount: convertCurrencyStringToNumber(data.loan_amount),
      loan_term: data.loan_term,
      cibil_score: data.cibil_score,
      residential_assets_value: convertCurrencyStringToNumber(
        data.residential_assets_value
      ),
      commercial_assets_value: convertCurrencyStringToNumber(
        data.commercial_assets_value
      ),
      luxury_assets_value: convertCurrencyStringToNumber(
        data.luxury_assets_value
      ),
      bank_asset_value: convertCurrencyStringToNumber(data.bank_asset_value),
      education: data.education,
      self_employed: data.self_employed,
    };

    const response = await axios.post(
      "http://localhost:5000/api",
      formattedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const genAI = new GoogleGenerativeAI(
      "AIzaSyA0YRmZnI_qmAPrjGZfPLUemM0pJP9I1Pk"
    );

    const systemInstruction = translate
    ? `Provide tailored loan recommendations and financial insights based on my current financial status and profile. Present the suggestions in concise bullet points, each with a clear heading. Ensure the points are straightforward, engaging, and easy to read, offering actionable advice without overwhelming the reader. Keep the overall length within 50-60 words. Give result in Hindi.`
    : `Provide tailored loan recommendations and financial insights based on my current financial status and profile. Present the suggestions in concise bullet points, each with a clear heading. Ensure the points are straightforward, engaging, and easy to read, offering actionable advice without overwhelming the reader. Keep the overall length within 50-60 words. Give result in English.`;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction,
  });

    const responseAI = await model.generateContent(
      `This is my financial status: ${JSON.stringify(formattedData)}`
    );
    const result = await responseAI.response;
    setAiSuggestion(result.text());

    setAiSuggestion(result.text());

    setResult(response.data);
  };

  return (
    <div className="space-y-4">
      <div className="min-h-screen bg-blue-50 p-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            {translate ? "Show in English" : "Translate to Hindi"}
          </button>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 ">
          <div className="flex-1">
            <Card className="w-full bg-white shadow-lg">
              <CardHeader className="">
                <CardTitle className="text-2xl font-bold">
                  {translate ? "ऋण पात्रता जाँच" : "Loan Eligibility Check"}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="no_of_dependents">
                        {translate ? "आश्रितों की संख्या" : "Number of Dependents"}
                      </Label>
                      <Controller
                        name="no_of_dependents"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input type="number" {...field} className="mt-1" />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="education">{translate ? "शिक्षा" : "Education"}</Label>
                      <Controller
                        name="education"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={translate ? "चुनें" : "Select"} />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="1">{translate ? "स्नातक" : "Graduate"}</SelectItem>
                              <SelectItem value="0">{translate ? "स्नातक नहीं" : "Not Graduate"}</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="self_employed">{translate ? "स्वरोजगार" : "Self Employed"}</Label>
                      <Controller
                        name="self_employed"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder={translate ? "चुनें" : "Select"} />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="1">{translate ? "हाँ" : "Yes"}</SelectItem>
                              <SelectItem value="0">{translate ? "नहीं" : "No"}</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="income_annum">
                        {translate ? "वार्षिक आय (INR)" : "Annual Income (INR)"}
                      </Label>
                      <Controller
                        name="income_annum"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            thousandSeparator={true}
                            prefix="₹"
                            decimalScale={2}
                            fixedDecimalScale
                            customInput={Input}
                            className="mt-1"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="loan_amount">
                        {translate ? "ऋण राशि (INR)" : "Loan Amount (INR)"}
                      </Label>
                      <Controller
                        name="loan_amount"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            thousandSeparator={true}
                            prefix="₹"
                            decimalScale={2}
                            fixedDecimalScale
                            customInput={Input}
                            className="mt-1"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="loan_term">
                        {translate ? "ऋण अवधि (महीने)" : "Loan Term (Months)"}
                      </Label>
                      <Controller
                        name="loan_term"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input type="number" {...field} className="mt-1" />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cibil_score">
                        {translate ? "सिबिल स्कोर" : "CIBIL Score"}
                      </Label>
                      <Controller
                        name="cibil_score"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Input type="number" {...field} className="mt-1" />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="residential_assets_value">
                        {translate ? "आवासीय संपत्ति मूल्य (INR)" : "Residential Asset Value (INR)"}
                      </Label>
                      <Controller
                        name="residential_assets_value"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            thousandSeparator={true}
                            prefix="₹"
                            decimalScale={2}
                            fixedDecimalScale
                            customInput={Input}
                            className="mt-1"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="commercial_assets_value">
                        {translate ? "व्यावसायिक संपत्ति मूल्य (INR)" : "Commercial Asset Value (INR)"}
                      </Label>
                      <Controller
                        name="commercial_assets_value"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            thousandSeparator={true}
                            prefix="₹"
                            decimalScale={2}
                            fixedDecimalScale
                            customInput={Input}
                            className="mt-1"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="luxury_assets_value">
                        {translate ? "विलासिता संपत्ति मूल्य (INR)" : "Luxury Asset Value (INR)"}
                      </Label>
                      <Controller
                        name="luxury_assets_value"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            thousandSeparator={true}
                            prefix="₹"
                            decimalScale={2}
                            fixedDecimalScale
                            customInput={Input}
                            className="mt-1"
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bank_asset_value">
                        {translate ? "बैंक संपत्ति मूल्य (INR)" : "Bank Asset Value (INR)"}
                      </Label>
                      <Controller
                        name="bank_asset_value"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <NumericFormat
                            thousandSeparator={true}
                            prefix="₹"
                            decimalScale={2}
                            fixedDecimalScale
                            customInput={Input}
                            className="mt-1"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gray-950 hover:bg-gray-700 text-white"
                  >
                    {translate ? "पात्रता जाँचें" : "Check Eligibility"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-1/3">
            <Card className="bg-white shadow-lg h-full">
              <CardHeader className="">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <CardTitle className="text-2xl font-bold">
                    {translate ? "एआई सुझाव" : "AI Suggestions"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="mt-6 ">
                {aiSuggestion ? (
                  <div className="prose prose-blue">
                    <p className="text-gray-700 text-[18px]">
                      <Markdown>{aiSuggestion}</Markdown>
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <p className="text-lg font-medium">
                      Fill the form to get AI-powered loan suggestions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <ResultDisplay
          result={result?.result}
          probability={result?.probability}
        />
        <div className="flex justify-center items-center my-6">
          <div className="w-[80%] flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100">
            <div className="font-medium text-xl">
              {translate ? "मॉडल कैसे काम करता है?" : "How model works?"}
            </div>
            <a href="https://drive.google.com/file/d/1k-JhtjPkTju7laziQvX30tt_yJF6pCRS/view?usp=drive_link" target="_blank">
              <SquareArrowOutUpRightIcon className="w-6 h-6 text-blue-600 transition-transform duration-300 hover:scale-110" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
