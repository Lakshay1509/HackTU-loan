import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { LoanCard } from "./loan-card"

const recommendedLoans = [
  { name: "Personal Loan", interestRate: 8.5, emi: 1200, tenure: 36, isRecommended: true },
  { name: "Home Loan", interestRate: 6.5, emi: 2500, tenure: 240 },
  { name: "Car Loan", interestRate: 7.5, emi: 800, tenure: 60 },
  { name: "Education Loan", interestRate: 9.0, emi: 1000, tenure: 48 },
]

export default function RecommendedLoans() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-700">Top Recommended Loans</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {recommendedLoans.map((loan, index) => (
              <CarouselItem key={index}>
                <LoanCard {...loan} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  )
}

