import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';
import QuickActionBox from './QuickActionBox';

const TotalBalanceBox = ({
  accounts = [], totalBanks, totalCurrentBalance
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance flex items-center justify-between ">
      <div className="flex gap-8 ">
        <div className="total-balance-chart">
          <DoughnutChart accounts={accounts} />
        </div>

        <div className="flex flex-col gap-6 ">
          <h2 className="header-2 ">
            Bank Accounts: {totalBanks}
          </h2>
          <div className="flex flex-col gap-2">
            <p className="total-balance-label">
              Total Current Balance
            </p>

            <div className="total-balance-amount flex-center gap-4">
              <AnimatedCounter amount={totalCurrentBalance} />
            </div>
          </div>
        </div>
      </div>
      
      <QuickActionBox/>
    </section>
  )
}

export default TotalBalanceBox