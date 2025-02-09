"use client"

import Link from "next/link"
import { Send, Wallet ,MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

const QuickActionBox = () => {
  const quickActions = [
    { title: "Send Money", href: "/payment-transfer", icon: Send },
    { title: "Request Loan", href: "/loan", icon: Wallet },
    { title: "Chat", href: "/chat", icon: MessageSquare },
  ]

  return (
    <section className="bg-transparent p-6 rounded-xl ">
      <div className="flex flex-col gap-6">
        {/* <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2> */}

        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 group"
              >
                <span className="text-3xl mb-3 text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                  {<action.icon className="w-6 h-6" />}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {action.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default QuickActionBox

