import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface Recommendation {
  emi: number;
  interest_rate: number;
  loan_amount: number;
  tenure_months: number;
  total_payment: number;
}

interface LoanCalculationResult {
  current_emi_sip: number;
  emi: number;
  recommendations: {
    extended_tenure: Recommendation;
    reduced_amount: Recommendation;
  } | null;
  result: string;
  total_payment: number;
}

interface LoanCalculationResultsProps {
  results: LoanCalculationResult;
}

export function LoanCalculationResults({ results }: LoanCalculationResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const exist = results?.recommendations?.extended_tenure?.loan_amount != null;

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">Loan Calculation Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Current Situation</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Current EMI/SIP</TableCell>
                <TableCell>{formatCurrency(results.current_emi_sip)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Calculated EMI</TableCell>
                <TableCell>{formatCurrency(results.emi)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Payment</TableCell>
                <TableCell>{formatCurrency(results.total_payment)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {results.recommendations === null ? (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Loan Approved</AlertTitle>
            <AlertDescription className="text-green-700">
              Based on your current financial situation, you are eligible to take this loan.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert variant="default" className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Loan Adjustment Needed</AlertTitle>
              <AlertDescription className="text-yellow-700">
                We recommend adjusting your loan terms. Please review the options below.
              </AlertDescription>
            </Alert>
            <div>
              <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Option</TableHead>
                    {exist &&<TableHead>Extended Tenure</TableHead>}
                    <TableHead>Reduced Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow>
                    <TableCell className="font-medium">Loan Amount</TableCell>
                    {exist && <TableCell>{formatCurrency(results.recommendations.extended_tenure?.loan_amount)}</TableCell>}
                    <TableCell>{formatCurrency(results.recommendations.reduced_amount?.loan_amount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">EMI</TableCell>
                    {exist &&<TableCell>{formatCurrency(results.recommendations.extended_tenure?.emi)}</TableCell>}
                    <TableCell>{formatCurrency(results.recommendations.reduced_amount?.emi)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Interest Rate</TableCell>
                    {exist &&<TableCell>{results.recommendations.extended_tenure?.interest_rate}%</TableCell>}
                    <TableCell>{results.recommendations.reduced_amount?.interest_rate}%</TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="font-medium">Tenure (Months)</TableCell>
                    {exist &&<TableCell>{results.recommendations.extended_tenure?.tenure_months}</TableCell>}
                    <TableCell>{results.recommendations.reduced_amount?.tenure_months}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Payment</TableCell>
                    {exist &&<TableCell>{formatCurrency(results.recommendations.extended_tenure?.total_payment)}</TableCell>}
                    <TableCell>{formatCurrency(results.recommendations.reduced_amount?.total_payment)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

