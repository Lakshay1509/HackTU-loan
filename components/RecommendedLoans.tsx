import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { recommendedLoans } from '../dummyData'
import { formatCurrency } from '../utils/formatCurrency'

export default function RecommendedLoans() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-600">Recommended Loans</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>EMI%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recommendedLoans.map((loan, index) => (
              <TableRow key={index}>
                <TableCell>{formatCurrency(loan.amount)}</TableCell>
                <TableCell>{loan.year}</TableCell>
                <TableCell>{loan.emiPercentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

