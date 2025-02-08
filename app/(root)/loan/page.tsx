import LoanForm from '../../../components/LoanForm'
import RecommendedLoans from '@/components/RecommendedLoans'
import LoanCalculator from '../../../components/LoanCalculator'

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
export default async function Home() {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ 
    userId: loggedIn.$id 
  })

  if(!accounts) return;
  
  const accountsData = accounts?.data;
  const appwriteItemId = accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId })

  const transactions = account?.transactions;

  
  return (
    <div className="flex h-100 overflow-auto">
      <div className="w-3/5 p-8">
        <LoanForm />
      </div>
      <div className="w-2/5 p-8 space-y-8">
        <RecommendedLoans />
        <LoanCalculator transactions={transactions} />
      </div>
    </div>
  )
}

