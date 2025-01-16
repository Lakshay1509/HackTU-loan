export enum LoanCategory {
  Personal = "Personal",
  Marriage = "Marriage",
  Education = "Education",
  HomeLoan = "Home Loan",
  CarLoan = "Car Loan",
}

export interface Loan {
  amount: number;
  year: number;
  emiPercentage: number;
}

