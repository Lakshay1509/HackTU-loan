import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  const categories: CategoryCount[] = countTransactionCategories(transactions);

  return (
    <aside className="right-sidebar bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-l-2xl p-6">
      <section className="flex flex-col pb-8">
        <div className="profile hover:shadow-md transition-all duration-300 p-4 rounded-xl bg-white">
          <div className="profile-img bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-4 shadow-lg">
            <span className="text-4xl font-bold text-white">{user.firstName[0]}</span>
          </div>

          <div className="profile-details mt-4">
            <h1 className='profile-name text-xl font-bold text-gray-800 hover:text-yellow-600 transition-colors'>
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email text-sm text-gray-600">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      <section className="banks space-y-6">
        <div className="flex w-full justify-between items-center">
          <h2 className="header-2 text-lg font-bold text-gray-800">My Banks</h2>
          <Link href="/" className="flex gap-2 items-center hover:bg-yellow-50 p-2 rounded-lg transition-all">
            <Image 
              src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus"
              className="opacity-70"
            />
            <h2 className="text-sm font-semibold text-gray-600 hover:text-yellow-600">
              Add Bank
            </h2>
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className='relative z-10 transform hover:scale-105 transition-transform duration-300'>
              <BankCard 
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%] opacity-70 hover:opacity-100 transition-opacity">
                <BankCard 
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-1 flex-col gap-6">
          <h2 className="header-2 text-lg font-bold text-gray-800">Top categories</h2>

          <div className='space-y-4'>
            {categories.map((category, index) => (
              <div key={category.name} className="hover:translate-x-2 transition-transform duration-300">
                <Category category={category} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </aside>
  )
}

export default RightSidebar