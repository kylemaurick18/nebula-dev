'use client'

import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface Activity {
  id: string
  type: string
  description: string
  date: string
  commissionFee: number
  amount: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/sign-in')
      return
    }

    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
  }, [status, session])

  // Mobile menu toggle logic
  useEffect(() => {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const sideMenu = document.querySelector('.side-menu');

    if (!menuButton || !sideMenu) return;

    const toggleMenu = (event: Event) => {
      event.stopPropagation();
      sideMenu.classList.toggle('active');
    };

    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (
        !sideMenu.contains(target) &&
        !menuButton.contains(target) &&
        sideMenu.classList.contains('active')
      ) {
        sideMenu.classList.remove('active');
      }
    };

    menuButton.addEventListener('click', toggleMenu);
    document.addEventListener('click', handleClickOutside);

    return () => {
      menuButton.removeEventListener('click', toggleMenu);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (loading || status === 'loading') {
    return <div className="text-white p-8">Loading dashboard...</div>
  }

  const activities = user.activities

  const allTimeEarnings = activities
    .filter((a: Activity) => a.type === 'earning')
    .reduce((sum: number, a: Activity) => sum + a.amount, 0)

  const deposits = activities
    .filter((a: Activity) => a.type === 'deposit')
    .reduce((sum: number, a: Activity) => sum + a.amount, 0)

  const withdrawals = activities
    .filter((a: Activity) => a.type === 'withdrawal')
    .reduce((sum: number, a: Activity) => sum + a.amount, 0)

  const netCapital = deposits - withdrawals

  const estimatedYield = netCapital > 0
    ? ((allTimeEarnings / netCapital) * 100).toFixed(2)
    : '0.00'

  const accountType = user.accountType || 'Standard'

  const createdOn = activities.length > 0
    ? new Date(activities[0].date).toLocaleDateString()
    : new Date(user.createdAt).toLocaleDateString()

  const hourlyData: { hour: string; balance: number }[] = []

  let runningBalance = 0
  const sorted = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  for (const curr of sorted) {
    const hour = new Date(curr.date)
    hour.setSeconds(0, 0)
    const minuteKey = hour.toISOString()

    runningBalance += curr.amount

    const last = hourlyData[hourlyData.length - 1]
    if (last?.hour === minuteKey) {
      last.balance = runningBalance
    } else {
      hourlyData.push({ hour: minuteKey, balance: runningBalance })
    }
  }


  return (
    <div>
      <div className="page-header">
        <Image src="/images/nebula-dashboard-icon.png" loading="eager" alt="" className="dashboard-icon-desktop" width={30} height={30}/>
        <div className="mobile-menu-btn">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.6882 20.3262L10.3343 20.3262" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M20.6882 15.3262L10.3343 15.3262" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M20.6882 10.3262L10.3343 10.3262" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="page-header-text">{user.firstName}</div>
        <div className="breadcrumbs-slash">
          <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.03857 2.09277L1.96153 11.9074" stroke="#2F2F2F" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="page-header-text">Portfolio</div>
        <Image src="/images/Ellipse-123.svg" loading="lazy" width={28} height={28} alt="" className="ellipse-123"/>
        <Image src="/images/nebula-dashboard-icon.png" loading="eager" alt="" className="dashboard-icon-mobile" width={30} height={30}/>
      </div>
      <div className="page-container">
        <div className="side-menu">
          <Link href="/dashboard" className="menu-btn w--current">
            <div className="btn-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.08146 12.4765V8.6394C6.08146 8.46981 6.01408 8.30711 5.89415 8.18721C5.77422 8.0673 5.61156 7.99989 5.44195 7.99989H2.8839C2.71429 7.99989 2.55163 8.0673 2.43169 8.18721C2.31176 8.30711 2.24438 8.46981 2.24438 8.6394V12.4765C2.24438 12.6461 2.31176 12.8088 2.43169 12.9287C2.55163 13.0486 2.71429 13.116 2.8839 13.116M6.08146 12.4765C6.08146 12.6461 6.01408 12.8088 5.89415 12.9287C5.77422 13.0486 5.61156 13.116 5.44195 13.116H2.8839M6.08146 12.4765C6.08146 12.6461 6.14884 12.8088 6.26877 12.9287C6.3887 13.0486 6.55136 13.116 6.72097 13.116H9.27903C9.44862 13.116 9.61132 13.0486 9.73122 12.9287C9.85113 12.8088 9.91854 12.6461 9.91854 12.4765M6.08146 12.4765V6.08135C6.08146 5.91174 6.14884 5.74908 6.26877 5.62915C6.3887 5.50922 6.55136 5.44184 6.72097 5.44184H9.27903C9.44862 5.44184 9.61132 5.50922 9.73122 5.62915C9.85113 5.74908 9.91854 5.91174 9.91854 6.08135V12.4765M2.8839 13.116H11.8371M9.91854 12.4765C9.91854 12.6461 9.98594 12.8088 10.1059 12.9287C10.2258 13.0486 10.3885 13.116 10.5581 13.116H13.1161C13.2857 13.116 13.4484 13.0486 13.5683 12.9287C13.6882 12.8088 13.7556 12.6461 13.7556 12.4765V3.5233C13.7556 3.35369 13.6882 3.19103 13.5683 3.0711C13.4484 2.95117 13.2857 2.88379 13.1161 2.88379H10.5581C10.3885 2.88379 10.2258 2.95117 10.1059 3.0711C9.98594 3.19103 9.91854 3.35369 9.91854 3.5233V12.4765Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg></div>
            <div>Portfolio</div>
          </Link>
          <Link href="/deposit" className="menu-btn">
            <div className="btn-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.99988 10.741V5.25875M7.99988 10.741L5.94403 8.68519M7.99988 10.741L10.0558 8.68519M12.1116 3.88818C11.5716 3.34822 10.9306 2.91991 10.2251 2.62768C9.51962 2.33546 8.7635 2.18506 7.99988 2.18506C7.23627 2.18506 6.48013 2.33546 5.77465 2.62768C5.06916 2.91991 4.42814 3.34822 3.88818 3.88818C3.34822 4.42814 2.91991 5.06916 2.62768 5.77464C2.33546 6.48013 2.18506 7.23626 2.18506 7.99988C2.18506 8.76349 2.33546 9.51961 2.62768 10.2251C2.91991 10.9306 3.34822 11.5716 3.88818 12.1116C4.97867 13.2021 6.45769 13.8147 7.99988 13.8147C9.54203 13.8147 11.0211 13.2021 12.1116 12.1116C13.2021 11.0211 13.8147 9.54203 13.8147 7.99988C13.8147 6.45769 13.2021 4.97867 12.1116 3.88818Z" stroke="currentColor" strokeLinecap="round"></path>
            </svg></div>
            <div>Deposit</div>
          </Link>
          <Link href="/withdraw" className="menu-btn">
            <div className="btn-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.99988 5.259V10.7413M7.99988 5.259L5.94403 7.31481M7.99988 5.259L10.0558 7.31481M12.1116 12.1118C11.5716 12.6518 10.9306 13.0801 10.2251 13.3723C9.51962 13.6645 8.7635 13.8149 7.99988 13.8149C7.23627 13.8149 6.48013 13.6645 5.77465 13.3723C5.06916 13.0801 4.42814 12.6518 3.88818 12.1118C3.34822 11.5719 2.91991 10.9308 2.62768 10.2254C2.33546 9.51987 2.18506 8.76374 2.18506 8.00012C2.18506 7.23651 2.33546 6.48039 2.62768 5.7749C2.91991 5.0694 3.34822 4.4284 3.88818 3.8884C4.97867 2.7979 6.45769 2.1853 7.99988 2.1853C9.54203 2.1853 11.0211 2.7979 12.1116 3.8884C13.2021 4.9789 13.8147 6.45797 13.8147 8.00012C13.8147 9.54231 13.2021 11.0213 12.1116 12.1118Z" stroke="currentColor" strokeLinecap="round"></path>
            </svg></div>
            <div>Withdraw</div>
          </Link>
          <button className="menu-btn last" onClick={() => signOut({ callbackUrl: '/sign-in' })}>
            <div className="btn-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.48657 9.09034L6.19078 4.84375M2.48657 9.08839L6.19077 13.335" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2.48657 9.09041L8.31598 9.09041C11.1864 9.09041 13.5133 6.76348 13.5133 3.89307V3.89307" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>Sign out</div>
          </button>
        </div>

        <div className="page-card">
          <div className="portfolio-header-flex">
            <div className="flex dynamic-col-gap-1">
              <div className="portfolio-balance-container">
                <div className="portfolio-balance">${activities.reduce((acc: number, curr: Activity) => acc + curr.amount, 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  <span className="portfolio-balance-cents">.00</span>
                </div>
                <div className="text-m-muted">Available balance</div>
              </div>
            </div>

            <div className="flex-display-desktop">
              <Link href="/deposit" className="btn-white">
                <div className="btn-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00037 10.741V5.25875M8.00037 10.741L5.94452 8.68519M8.00037 10.741L10.0563 8.68519M12.1121 3.88818C11.5721 3.34822 10.9311 2.91991 10.2256 2.62768C9.52011 2.33546 8.76399 2.18506 8.00037 2.18506C7.23676 2.18506 6.48062 2.33546 5.77514 2.62768C5.06965 2.91991 4.42863 3.34822 3.88867 3.88818C3.34871 4.42814 2.9204 5.06916 2.62817 5.77464C2.33595 6.48013 2.18555 7.23626 2.18555 7.99988C2.18555 8.76349 2.33595 9.51961 2.62817 10.2251C2.9204 10.9306 3.34871 11.5716 3.88867 12.1116C4.97916 13.2021 6.45818 13.8147 8.00037 13.8147C9.54252 13.8147 11.0216 13.2021 12.1121 12.1116C13.2026 11.0211 13.8152 9.54203 13.8152 7.99988C13.8152 6.45769 13.2026 4.97867 12.1121 3.88818Z" stroke="black" strokeLinecap="round" />
                  </svg>
                </div>
                <div>Deposit</div>
              </Link>

              <Link href="/withdraw" className="btn-outlined">
                <div className="btn-icon">
                  <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.86414 5.259V10.7413M8.86414 5.259L6.80829 7.31481M8.86414 5.259L10.92 7.31481M12.9758 12.1118C12.4358 12.6518 11.7948 13.0801 11.0893 13.3723C10.3839 13.6645 9.62776 13.8149 8.86414 13.8149C8.10053 13.8149 7.34439 13.6645 6.63891 13.3723C5.93342 13.0801 5.2924 12.6518 4.75244 12.1118C4.21248 11.5719 3.78417 10.9308 3.49194 10.2254C3.19972 9.51987 3.04932 8.76374 3.04932 8.00012C3.04932 7.23651 3.19972 6.48039 3.49194 5.7749C3.78417 5.0694 4.21248 4.4284 4.75244 3.8884C5.84293 2.7979 7.32195 2.1853 8.86414 2.1853C10.4063 2.1853 11.8853 2.7979 12.9758 3.8884C14.0663 4.9789 14.6789 6.45797 14.6789 8.00012C14.6789 9.54231 14.0663 11.0213 12.9758 12.1118Z" stroke="white" strokeLinecap="round" />
                  </svg>
                </div>
                <div>Withdraw</div>
              </Link>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={220} className="canvas">
              <AreaChart data={hourlyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4ad" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#2dd4ad" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="balance" stroke="#2dd4ad" strokeWidth={1.5} fill="url(#chartGradient)" fillOpacity={1} dot={false} isAnimationActive={true} activeDot={false} />
                <XAxis dataKey="hour" hide />
                <YAxis domain={['auto', 'auto']} hide />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="stats-card">
            <div className="stats-container">
              <div className="text-m-muted">Status</div>
              <div className="flex col-gap-6 align-y-center"><div className="status-dot-active"></div><div className="text-m">Active</div></div>
            </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">Earnings</div>
                <div className="text-m profit">${allTimeEarnings.toFixed(2)}</div>
              </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">Estimated yield</div>
              <div className="text-m">{estimatedYield}%</div>
            </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">Maximum Risk</div>
              <div className="text-m">3.00%</div>
            </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">Account</div>
              <div className="text-m">{accountType}</div>
            </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">Created On</div>
              <div className="text-m">{createdOn}</div>
            </div>
          </div>

          <div className="recent-activity">
            <div className="display-text-sm">Recent activity</div>

            <div className="recent-activity-heading">
              <div className="text-m-muted">Type</div>
              <div className="text-m-muted">Description</div>
              <div className="text-m-muted">Date</div>
              <div className="text-m-muted">Fee</div>
              <div className="text-m-muted text-align-right">Amount</div>
            </div>

            {activities.map((activity: any) => (
              <div className={`recent-activity-li ${activity === activities[activities.length - 1] ? 'last' : ''}`} key={activity.id} >
                <div className="text-m">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</div>
                <div className="text-m">{activity.description || '-'}</div>
                <div className="text-m">
                  {(() => {
                    const date = new Date(activity.date);
                    const day = date.getDate();
                    const month = date.toLocaleString(undefined, { month: 'short' });
                    const year = date.getFullYear();

                    return `${month}, ${day} ${year}`;
                  })()}
                </div>
                <div className="text-m-muted">- ${activity.commissionFee.toFixed(2)}</div>
                <div className="flex col-gap-12 align-y-center align-x-right">
                  <div className={`text-m ${activity.amount >= 0 ? 'profit' : 'loss'}`}>
                    {activity.amount >= 0 ? '+' : '-'} ${Math.abs(activity.amount).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="disclosure-text">Nebula LTD is an Investment Firm registered in Seychelles with registration number 8423607-1 and authorised by the Financial Services Authority (FSA) with licence number SD024. The information on this website may only be copied with the express written permission of Nebula. General Risk Warning: CFDs are leveraged products. Trading in CFDs carries a high level of risk thus may not be appropriate for all investors. The investment value can both increase and decrease and the investors may lose all their invested capital. <br /><br />Under no circumstances shall the Company have any liability to any person or entity for any loss or damage in whole or part caused by, resulting from, or relating to any transactions related to CFDs.N complies with the Payment Card Industry Data Security Standard (PCI DSS) to ensure your security and privacy. We conduct regular vulnerability scans and penetration tests in accordance with the PCI DSS requirements for our business mode<br />
          </div>
        </div>
      </div>
    </div>
  )
}
