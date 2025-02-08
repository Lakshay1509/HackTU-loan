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

  const [phoneNumber, setPhoneNumber] = useState('');

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

  const sendOTP = async () => {
    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phoneNumber }),
      });
      const data = await res.json();
      console.log(data); // logs { sid: '...' } if successful
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <Card className="w-full " ref={pdfRef}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Loan Application
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold ">
              Personal Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select>
                  <SelectTrigger id="maritalStatus">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="residentialAddress">Residential Address</Label>
              <Textarea
                id="residentialAddress"
                placeholder="Enter your residential address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentAddress">Permanent Address</Label>
              <Textarea
                id="permanentAddress"
                placeholder="Enter your permanent address"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Loan Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Loan</Label>
                <Select>
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select loan category" />
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
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter loan amount"
                  min="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="Enter loan term in years"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold ">
              Document Uploads
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="AadharCard">Aadhar Card</Label>
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
                  Verify
                </Button>
              </div>
              {/* <div>{aadharProofURL}</div> */}
              <AadharAnimation message={aadharProofURL} />
              <div className="space-y-2">
                <Label htmlFor="PANCard">PAN Card</Label>
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
                Verify
              </Button>
              </div>
              <PANCardAnimation message={PANProofURL} />
            </div>
          </div>

          {/* <Button
            type="submit"
            className="w-full bg-gray-950 hover:bg-gray-700 text-white"
          >
            Submit Application
          </Button> */}
          <Button
        type="button"
        onClick={handleDownloadPDF}
        className="w-full  bg-gray-950 hover:bg-gray-700 text-white mt-4"
      >
        Download as PDF
      </Button>
        </form>
      
      
        {/* <Input
  placeholder="Phone number"
  onChange={(e) => setPhoneNumber(e.target.value)}
/>
<Button type="button" onClick={sendOTP}>
  Send OTP
</Button> */}


      </CardContent>
    </Card>
  );
}

