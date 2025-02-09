"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BanknoteIcon as Bank, CreditCard, History, Home, MessageSquare, Send, Shield, Wallet , GlobeLock,Captions } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import PlaidLink from './PlaidLink'
import Footer from "./Footer"
import Image from "next/image"



const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "My Banks", href: "/my-banks", icon: Bank },
  { name: "Transaction History", href: "/transaction-history", icon: History },
  { name: "Transfer Funds", href: "/payment-transfer", icon: Send },
  { name: "Eligibility Check", href: "/application", icon: Shield },
  { name: "Loan", href: "/loan", icon: Wallet },
  {name : "Submit Application", href: "http://localhost:9000/", icon: Captions},
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Privacy Policy", href: "https://drive.google.com/file/d/1G_797YpinPpsrxlXc9J08XCfp4VI0Dlo/view?usp=sharing", icon: GlobeLock },
  
]

export default function Sidebar({ user }: SiderbarProps) {
  const pathname = usePathname()

  return (
    <div className="flex w-64 flex-col border-r  bg-card px-3 py-4">
      <div className="mb-8 flex items-center px-4 mt-6 ">
        <Image src="/icons/new_logo.png" alt="logo" width={200} height={200} />
        {/* <h1 className="text-2xl font-bold">CRED GURU</h1> */}
      </div>
      <div className="space-y-4 flex-grow">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.name}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-[16px]", 
                pathname === item.href 
                  ? "bg-gray-200 hover:bg-gray-300" 
                  : "hover:bg-gray-100"
              )}
              asChild
            >
              
              <Link href={item.href} >
                <Icon className="mr-2 h-6 w-6 " />
                {item.name}
              </Link>
            </Button>
          )
        })}
      </div>
      <div className="mt-auto">
        <PlaidLink user={user} />
        <Footer user={user} />
      </div>
    </div>
  )
}


