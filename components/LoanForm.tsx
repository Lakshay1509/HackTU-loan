"use client";

import { useState,useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AadharAnimation from "./AadharAnimation";
import PANCardAnimation from "./PANCardAnimation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LoanCategory } from "../types";
import axios from "axios";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function LoanForm() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [aadharProof, setaadharProof] = useState<File | null>(null);
  const [aadharProofURL, setaadharProofURL] = useState<string | null>(null);
  const [PANProof, setPANProof] = useState<File | null>(null);
  const [PANProofURL, setPANProofURL] = useState<string | null>(null);
  const [translate, setTranslate] = useState(false);

  const toggleLanguage = () => setTranslate((prev) => !prev);


  const handleAadharProofUpload = async (isAadhar: boolean) => {
    const data = new FormData();
    if (isAadhar) {
      setaadharProofURL("Verifying");

      if (!aadharProof) return;
      data.append("file", aadharProof);
    } else {
      setPANProofURL("Verifying");

      if (!PANProof) return;
      data.append("file", PANProof);
    }
    data.append("upload_preset", "HackTU");
    data.append("cloud_name", "backend-15");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/backend-15/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await response.json();

    const formattedData = {
      img: result.secure_url,
    };

    const VerifyResponse = await axios.post(
      "http://127.0.0.1:5000/analyze",
      formattedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (isAadhar) {
      setaadharProofURL(VerifyResponse.data.message);
    } else {
      setPANProofURL(VerifyResponse.data.message);
    }
  };



  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('loan-application.pdf');
  };

  



  return (
    <Card className="w-full " ref={pdfRef}>
      <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            {translate ? "Show in English" : "Translate to Hindi"}
          </button>
        </div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {translate ? "ऋण आवेदन" : "Loan Application"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {translate ? "व्यक्तिगत विवरण" : "Personal Details"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{translate ? "नाम" : "Name"}</Label>
                <Input id="name" placeholder={translate ? "अपना पूरा नाम दर्ज करें" : "Enter your full name"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">{translate ? "जन्म तिथि" : "Date of Birth"}</Label>
                <Input id="dob" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">{translate ? "लिंग" : "Gender"}</Label>
                <Select>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder={translate ? "लिंग चुनें" : "Select gender"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{translate ? "पुरुष" : "Male"}</SelectItem>
                    <SelectItem value="female">{translate ? "महिला" : "Female"}</SelectItem>
                    <SelectItem value="other">{translate ? "अन्य" : "Other"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">{translate ? "वैवाहिक स्थिति" : "Marital Status"}</Label>
                <Select>
                  <SelectTrigger id="maritalStatus">
                    <SelectValue placeholder={translate ? "वैवाहिक स्थिति चुनें" : "Select marital status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">{translate ? "अविवाहित" : "Single"}</SelectItem>
                    <SelectItem value="married">{translate ? "विवाहित" : "Married"}</SelectItem>
                    <SelectItem value="divorced">{translate ? "तलाकशुदा" : "Divorced"}</SelectItem>
                    <SelectItem value="widowed">{translate ? "विधवा/विधुर" : "Widowed"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="residentialAddress">{translate ? "वर्तमान पता" : "Residential Address"}</Label>
              <Textarea
                id="residentialAddress"
                placeholder={translate ? "अपना वर्तमान पता दर्ज करें" : "Enter your residential address"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentAddress">{translate ? "स्थायी पता" : "Permanent Address"}</Label>
              <Textarea
                id="permanentAddress"
                placeholder={translate ? "अपना स्थायी पता दर्ज करें" : "Enter your permanent address"}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {translate ? "ऋण विवरण" : "Loan Details"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">{translate ? "ऋण का उद्देश्य" : "Purpose of Loan"}</Label>
                <Select>
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder={translate ? "ऋण श्रेणी चुनें" : "Select loan category"} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.values(LoanCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">{translate ? "राशि" : "Amount"}</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={translate ? "ऋण राशि दर्ज करें" : "Enter loan amount"}
                  min="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">{translate ? "अवधि (वर्षों में)" : "Year"}</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder={translate ? "ऋण अवधि वर्षों में दर्ज करें" : "Enter loan term in years"}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {translate ? "दस्तावेज़ अपलोड" : "Document Uploads"}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="AadharCard">{translate ? "आधार कार्ड" : "Aadhar Card"}</Label>
                <Input
                  id="AadharCard"
                  type="file"
                  name="AadharCard"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setaadharProof(files[0]);
                    }
                  }}
                />

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAadharProofUpload(true);
                  }}
                >
                  {translate ? "सत्यापित करें" : "Verify"}
                </Button>
              </div>
              <AadharAnimation message={aadharProofURL} />
              <div className="space-y-2">
                <Label htmlFor="PANCard">{translate ? "पैन कार्ड" : "PAN Card"}</Label>
                <Input
                  id="PANCard"
                  type="file"
                  name="PANCard"
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      setPANProof(files[0]);
                    }
                  }}
                />
                <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleAadharProofUpload(false);
                }}
              >
                {translate ? "सत्यापित करें" : "Verify"}
              </Button>
              </div>
              <PANCardAnimation message={PANProofURL} />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleDownloadPDF}
            className="w-full bg-gray-950 hover:bg-gray-700 text-white mt-4"
          >
            {translate ? "पीडीएफ डाउनलोड करें" : "Download as PDF"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

