

import Chat from "@/components/Chat"
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";

const page = async() => {
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
    <>
    <Chat transactions={transactions} user={loggedIn?.firstName} />
    </>
  )
}


export default page
