'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function WithdrawPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<Linkny>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading || status === 'loading') {
    return <div className="text-white p-8">Loading withdraw page...</div>
  }

  return (
    <div className="body">

      <div className="page-header">
        <img src="/images/nebula-dashboard-icon.png" className="dashboard-icon-desktop" alt="" loading="eager" />

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

        <img src="/images/Ellipse-123.svg" width={28} height={28} alt="" className="ellipse-123" />
        <img src="/images/nebula-dashboard-icon.png" className="dashboard-icon-mobile" alt="" loading="eager" />
      </div>

      <div className="page-container">

        <div className="side-menu">
          <Link href="/dashboard" className="menu-btn">
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
          <Link href="/withdraw" className="menu-btn w--current">
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
          <div className="flex space-between mb-24">
            <div className="flex dynamic-col-gap-1">
              <div>
                <div className="display-text">Withdraw</div>
                <div className="text-m-muted">Select a payment method to withdraw funds from your account</div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="card">
              <div className="display-text-sm">Withdraw USDT</div>

              <div className="full-width mb-16">
                <div className="form-label">Network</div>
                <div className="form-input selectable">Ethereum (ERC20)</div>
              </div>

              <div className="full-width mb-16">
                <div className="form-label">Crypto address</div>
                <input type="text" className="form-input selectable" placeholder="Enter your wallet address" />
              </div>

              <div className="full-width mb-16">
                <div className="form-label">Withdraw amount</div>
                <input type="text" className="form-input selectable" placeholder="$100 - $100,000" />
              </div>

              <div className="deposit-requirements">
                <div className="deposit-requirements-li">
                  <div className="text-m">Withdrawal fee</div>
                  <div className="text-m text-align-right">0 USD</div>
                </div>
                <div className="deposit-requirements-li">
                  <div className="text-m">You will receive</div>
                  <div className="text-m text-align-right">0 USDT</div>
                </div>
                <div className="deposit-requirements-li last">
                  <div className="text-m">Processing time</div>
                  <div className="text-m text-align-right">2–30 mins</div>
                </div>
              </div>

              <div className="flex mb-16">
                <Link href="/withdraw" className="btn-white w--current">
                  <div>Continue to withdraw</div>
                </Link>
              </div>
            </div>
          </div>

          <div className="disclosure-text">
            Nebula LTD is an Investment Firm registered in Seychelles with registration number 8423607-1...<br /><br />
            Under no circumstances shall the Company have any liability to any person or entity for any loss or damage...
          </div>
        </div>
      </div>
    </div>
  )
}
