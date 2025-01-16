'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { LoanCategory } from '../types'
// import { formatCurrency } from '../utils/formatCurrency' // Removed as per update

export default function LoanForm() {
  const [identityProof, setIdentityProof] = useState<File | null>(null)
  const [addressProof, setAddressProof] = useState<File | null>(null)
  const [incomeProof, setIncomeProof] = useState<File | null>(null)
  const [loanSpecificDocs, setLoanSpecificDocs] = useState<File | null>(null)

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setter(e.target.files[0])
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-600">Loan Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Personal Details</h3>
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
              <Textarea id="residentialAddress" placeholder="Enter your residential address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentAddress">Permanent Address</Label>
              <Textarea id="permanentAddress" placeholder="Enter your permanent address" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Loan Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Loan</Label>
                <Select >
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select loan category" />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
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
                  min ="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" placeholder="Enter loan term in years" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">Document Uploads</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="identityProof">Identity Proof</Label>
                <Input id="identityProof" type="file" onChange={handleFileChange(setIdentityProof)} />
                {identityProof && <p className="text-sm text-blue-600">File uploaded: {identityProof.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressProof">Address Proof</Label>
                <Input id="addressProof" type="file" onChange={handleFileChange(setAddressProof)} />
                {addressProof && <p className="text-sm text-blue-600">File uploaded: {addressProof.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="incomeProof">Income Proof</Label>
                <Input id="incomeProof" type="file" onChange={handleFileChange(setIncomeProof)} />
                {incomeProof && <p className="text-sm text-blue-600">File uploaded: {incomeProof.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanSpecificDocs">Loan-Specific Documents</Label>
                <Input id="loanSpecificDocs" type="file" onChange={handleFileChange(setLoanSpecificDocs)} />
                {loanSpecificDocs && <p className="text-sm text-blue-600">File uploaded: {loanSpecificDocs.name}</p>}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

