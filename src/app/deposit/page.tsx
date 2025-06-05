'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const CryptoIcon = ({ type }: { type: 'btc' | 'usdt' | 'eth' }) => {
  const icons = {
    btc: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2294_2)">
          <path d="M23.6397 14.9031C22.0369 21.3317 15.5258 25.2441 9.09642 23.641C2.66967 22.0382 -1.2427 15.5267 0.360796 9.09847C1.9628 2.6691 8.47392 -1.24365 14.9014 0.359098C21.3304 1.96185 25.2424 8.4741 23.6397 14.9031Z" fill="#F7931A"/>
          <path d="M17.291 10.2908C17.5299 8.69402 16.3141 7.83564 14.6517 7.26302L15.191 5.10002L13.8744 4.77189L13.3494 6.87789C13.0032 6.79164 12.6477 6.71027 12.2945 6.62964L12.8232 4.50977L11.5074 4.18164L10.9677 6.34389C10.6812 6.27864 10.4 6.21414 10.127 6.14627L10.1285 6.13952L8.31273 5.68614L7.96248 7.09239C7.96248 7.09239 8.93935 7.31627 8.91873 7.33014C9.45198 7.46327 9.54835 7.81614 9.53223 8.09589L8.91798 10.56C8.95473 10.5694 9.00235 10.5829 9.05485 10.6039C9.01098 10.593 8.9641 10.581 8.91573 10.5694L8.05473 14.0213C7.98948 14.1833 7.8241 14.4263 7.45135 14.334C7.46448 14.3531 6.49435 14.0951 6.49435 14.0951L5.84073 15.6023L7.5541 16.0294C7.87285 16.1093 8.18523 16.1929 8.49273 16.2716L7.94785 18.4594L9.26298 18.7875L9.8026 16.623C10.1619 16.7205 10.5106 16.8105 10.8519 16.8953L10.3141 19.0496L11.6307 19.3778L12.1756 17.1941C14.4207 17.619 16.109 17.4476 16.8196 15.417C17.3922 13.782 16.7911 12.8389 15.6099 12.2239C16.4701 12.0255 17.1181 11.4596 17.291 10.2908ZM14.2827 14.5091C13.8759 16.1441 11.123 15.2603 10.2305 15.0386L10.9535 12.1403C11.846 12.363 14.708 12.804 14.2827 14.5091ZM14.69 10.2671C14.3187 11.7544 12.0275 10.9988 11.2842 10.8135L11.9397 8.18477C12.683 8.37002 15.0766 8.71577 14.69 10.2671Z" fill="white"/>
        </g>
        <defs>
          <clipPath id="clip0_2294_2">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    ),
    usdt: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2294_6)">
          <path d="M12 0C18.6271 0 24 5.37288 24 12C24 18.6271 18.6269 24 12 24C5.37312 24 0 18.6286 0 12C0 5.37144 5.37216 0 12 0Z" fill="#53AE94"/>
          <path d="M13.481 10.4015V8.6164H17.5632V5.89648H6.44735V8.6164H10.53V10.4001C7.21199 10.5525 4.71719 11.2096 4.71719 11.9968C4.71719 12.784 7.21319 13.4411 10.53 13.5945V19.3125H13.482V13.594C16.794 13.4411 19.2838 12.7845 19.2838 11.998C19.2838 11.2115 16.794 10.5549 13.482 10.402M13.482 13.1097V13.1082C13.3987 13.1135 12.9708 13.1392 12.018 13.1392C11.2562 13.1392 10.7203 13.1176 10.5314 13.1078V13.1102C7.60007 12.9803 5.41199 12.4698 5.41199 11.859C5.41199 11.2482 7.60031 10.7385 10.5314 10.6084V12.6016C10.7234 12.6148 11.2726 12.6472 12.0305 12.6472C12.9408 12.6472 13.3985 12.6093 13.4825 12.6016V10.6084C16.4081 10.7387 18.5911 11.2497 18.5911 11.8583C18.5911 12.467 16.4071 12.9782 13.4825 13.1085" fill="white"/>
        </g>
        <defs>
          <clipPath id="clip0_2294_6">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    ),
    eth: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2294_31)">
          <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#627EEA"/>
          <path d="M12.3735 3V9.6525L17.9962 12.165L12.3735 3Z" fill="white" fillOpacity="0.602"/>
          <path d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" fill="white"/>
          <path d="M12.3735 16.4759V20.9962L18 13.2119L12.3735 16.4759Z" fill="white" fillOpacity="0.602"/>
          <path d="M12.3735 20.9962V16.4752L6.75 13.2119L12.3735 20.9962Z" fill="white"/>
          <path d="M12.3735 15.43L17.9962 12.1653L12.3735 9.6543V15.43Z" fill="white" fillOpacity="0.2"/>
          <path d="M6.75 12.1653L12.3735 15.43V9.6543L6.75 12.1653Z" fill="white" fillOpacity="0.602"/>
        </g>
        <defs>
          <clipPath id="clip0_2294_31">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    )
  };

  return icons[type];
};

export default function DepositPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('usdt')

  // Payment method configurations
  const paymentMethods = {
    usdt: {
      name: 'Tether',
      network: 'USDT TRC20',
      icon: 'usdt',
      address: '9qV2fqEXE6xR9aNAgR3PJvL6PkdVbtz3AinQbznRnX9B',
      qrCode: '/images/qr-code.svg',
      minimumDeposit: '100 USD',
      confirmations: '15',
      processingTime: '2-30 mins',
      isRecommended: true,
      limits: '100 - 100,000 USD',
      fee: '0.00%'
    },
    btc: {
      name: 'Bitcoin',
      network: 'BTC',
      icon: 'btc',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      qrCode: '/images/qr-code.svg',
      minimumDeposit: '100 USD',
      confirmations: '3',
      processingTime: '10-60 mins',
      isRecommended: false,
      limits: '100 - 100,000 USD',
      fee: '0.00%'
    },
    eth: {
      name: 'Etherium',
      network: 'ETH ERC20',
      icon: 'eth',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      qrCode: '/images/qr-code.svg',
      minimumDeposit: '100 USD',
      confirmations: '12',
      processingTime: '5-30 mins',
      isRecommended: false,
      limits: '100 - 100,000 USD',
      fee: '0.00%'
    }
  }

  // Mobile menu functionality
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.side-menu') && !target.closest('.mobile-menu-btn')) {
      setIsMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Fetch user data
  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (session) {
      fetch('/api/activities')
        .then(res => res.json())
        .then(data => {
          setUser(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching user data:', error)
          setLoading(false)
        })
    }
  }, [status, session, router])

  if (status === 'loading' || loading) {
    return <div className="text-white p-8">Loading deposit page...</div>
  }

  if (!session) {
    return null
  }

  const selectedMethod = paymentMethods[selectedPaymentMethod as keyof typeof paymentMethods]

  return (
    <div className="body">
      <div className="page-header">
        <Image
          width={30}
          height={30}
          src="/images/nebula-dashboard-icon.png"
          loading="eager"
          alt=""
          className="dashboard-icon-desktop"
        />

        <div className="mobile-menu-btn" onClick={(e) => {
          e.stopPropagation()
          setIsMobileMenuOpen(!isMobileMenuOpen)
        }}>
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

        <div className="page-header-text">Deposit</div>

        <Image src="/images/Ellipse-123.svg" loading="lazy" width={28} height={28} alt="" className="ellipse-123" />
        <Image src="/images/nebula-dashboard-icon.png" loading="eager" alt="" className="dashboard-icon-mobile" width={30} height={30}/>
      </div>

      <div className="page-container">
        <div className={`side-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link href="/dashboard" className="menu-btn">
            <div className="btn-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.08146 12.4765V8.6394C6.08146 8.46981 6.01408 8.30711 5.89415 8.18721C5.77422 8.0673 5.61156 7.99989 5.44195 7.99989H2.8839C2.71429 7.99989 2.55163 8.0673 2.43169 8.18721C2.31176 8.30711 2.24438 8.46981 2.24438 8.6394V12.4765C2.24438 12.6461 2.31176 12.8088 2.43169 12.9287C2.55163 13.0486 2.71429 13.116 2.8839 13.116M6.08146 12.4765C6.08146 12.6461 6.01408 12.8088 5.89415 12.9287C5.77422 13.0486 5.61156 13.116 5.44195 13.116H2.8839M6.08146 12.4765C6.08146 12.6461 6.14884 12.8088 6.26877 12.9287C6.3887 13.0486 6.55136 13.116 6.72097 13.116H9.27903C9.44862 13.116 9.61132 13.0486 9.73122 12.9287C9.85113 12.8088 9.91854 12.6461 9.91854 12.4765M6.08146 12.4765V6.08135C6.08146 5.91174 6.14884 5.74908 6.26877 5.62915C6.3887 5.50922 6.55136 5.44184 6.72097 5.44184H9.27903C9.44862 5.44184 9.61132 5.50922 9.73122 5.62915C9.85113 5.74908 9.91854 5.91174 9.91854 6.08135V12.4765M2.8839 13.116H11.8371M9.91854 12.4765C9.91854 12.6461 9.98594 12.8088 10.1059 12.9287C10.2258 13.0486 10.3885 13.116 10.5581 13.116H13.1161C13.2857 13.116 13.4484 13.0486 13.5683 12.9287C13.6882 12.8088 13.7556 12.6461 13.7556 12.4765V3.5233C13.7556 3.35369 13.6882 3.19103 13.5683 3.0711C13.4484 2.95117 13.2857 2.88379 13.1161 2.88379H10.5581C10.3885 2.88379 10.2258 2.95117 10.1059 3.0711C9.98594 3.19103 9.91854 3.35369 9.91854 3.5233V12.4765Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg></div>
            <div>Portfolio</div>
          </Link>
          <Link href="/deposit" className="menu-btn w--current">
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
          <div className="flex space-between mb-24">
            <div className="flex dynamic-col-gap-1">
              <div>
                <div className="display-text">Deposit</div>
                <div className="text-m-muted">Select a payment method to deposit funds into your account</div>
              </div>
            </div>
          </div>

          <div className="deposit-flex-container">
            <div className="deposit-options-flex">
              {Object.entries(paymentMethods).map(([key, method]) => (
                <div 
                  key={key}
                  className={`payment-option ${key === selectedPaymentMethod ? 'selected' : ''}`}
                  onClick={() => setSelectedPaymentMethod(key)}
                >
                  <div className="deposit-crypto-type">
                    <div>
                      <div className="flex-x col-gap-12 y-align-middle">
                        <div className="payment-method-icon">
                          <CryptoIcon type={method.icon as 'btc' | 'usdt' | 'eth'} />
                        </div>
                        <div className="text-l">
                          {method.name} <span className="opacity-50">({method.network})</span>
                        </div>
                      </div>
                    </div>
                    {method.isRecommended && (
                      <div className="payment-option-badge">
                        <span className="green-tag"></span>Recommended
                      </div>
                    )}
                  </div>
                  <div className="deposit-details">
                    <div className="flex-x col-gap-8">
                      <div className="text-m-muted">Processing time</div>
                      <div className="text-m">{method.processingTime}</div>
                    </div>
                    <div className="flex-x col-gap-8">
                      <div className="text-m-muted">Fee</div>
                      <div className="text-m">{method.fee}</div>
                    </div>
                    <div className="flex-x col-gap-8">
                      <div className="text-m-muted">Limits</div>
                      <div className="text-m">{method.limits}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="payment-option disabled">
                <div className="deposit-crypto-type">
                  <div>
                    <div className="flex-x col-gap-12 y-align-middle">
                      <Image 
                        src="/images/card-payment.png" 
                        alt="Card payment" 
                        width={24} 
                        height={24} 
                        className="payment-method-icon"
                      />
                      <div className="text-l">Card payment</div>
                    </div>
                  </div>
                  <div className="payment-option-badge">
                    <span className="yellow-tag"></span>Unavailable
                  </div>
                </div>
                <div className="deposit-details">
                  <div className="flex-x col-gap-8">
                    <div className="text-m-muted">Processing time</div>
                    <div className="text-m">Instant - 30mins</div>
                  </div>
                  <div className="flex-x col-gap-8">
                    <div className="text-m-muted">Fee</div>
                    <div className="text-m">0.00%</div>
                  </div>
                  <div className="flex-x col-gap-8">
                    <div className="text-m-muted">Limits</div>
                    <div className="text-m">100 - 100,000 USD</div>
                  </div>
                </div>
              </div>
              <div className="payment-option disabled">
                <div className="deposit-crypto-type">
                  <div>
                    <div className="flex-x col-gap-12 y-align-middle">
                      <Image 
                        src="/images/bank.png" 
                        alt="Bank transfer" 
                        width={24} 
                        height={24} 
                        className="payment-method-icon"
                      />
                      <div className="text-l">Bank transfer</div>
                    </div>
                  </div>
                  <div className="payment-option-badge">
                    <span className="yellow-tag"></span>Unavailable
                  </div>
                </div>
                <div className="deposit-details">
                  <div className="flex-x col-gap-8">
                    <div className="text-m-muted">Processing time</div>
                    <div className="text-m">Instant - 30mins</div>
                  </div>
                  <div className="flex-x col-gap-8">
                    <div className="text-m-muted">Fee</div>
                    <div className="text-m">0.00%</div>
                  </div>
                  <div className="flex-x col-gap-8">
                    <div className="text-m-muted">Limits</div>
                    <div className="text-m">100 - 100,000 USD</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="deposit-card tether">
              <div className="display-text-sm">Deposit {selectedMethod.name}</div>
              
              <div className="flex col-gap-12 mb-16">
                <div className="full-width mb-16">
                  <div className="form-label">Network</div>
                  <div className="form-input selectable">{selectedMethod.network}</div>
                </div>
              </div>

              <div className="flex col-gap-12 mb-16">
                <div className="full-width mb-16">
                  <div className="flex">
                    <div className="form-label">Crypto address</div>
                  </div>
                  <p className="form-input selectable">{selectedMethod.address}</p>
                </div>
              </div>

              <div className="wallet-qr-code">
                <Image
                  width={180}
                  height={180}
                  src={selectedMethod.qrCode}
                  loading="lazy"
                  alt="QR Code"
                  className="qr-code"
                />
              </div>

              <div className="deposit-requirements">
                <div className="deposit-requirements-li">
                  <div className="text-m-muted">Minimum Deposit</div>
                  <div className="text-m text-align-right">{selectedMethod.minimumDeposit}</div>
                </div>
                <div className="deposit-requirements-li">
                  <div className="text-m-muted">Required confirmations</div>
                  <div className="text-m text-align-right">{selectedMethod.confirmations}</div>
                </div>
                <div className="deposit-requirements-li last">
                  <div className="text-m-muted">Processing time</div>
                  <div className="text-m text-align-right">{selectedMethod.processingTime}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="disclosure-text">
            Nebula LTD is an Investment Firm registered in Seychelles with registration number 8423607-1 and authorised by the Financial Services Authority (FSA) with licence number SD024. The information on this website may only be copied with the express written permission of Nebula. General Risk Warning: CFDs are leveraged products. Trading in CFDs carries a high level of risk thus may not be appropriate for all investors. The investment value can both increase and decrease and the investors may lose all their invested capital. <br /><br />
            Under no circumstances shall the Company have any liability to any person or entity for any loss or damage in whole or part caused by, resulting from, or relating to any transactions related to CFDs.N complies with the Payment Card Industry Data Security Standard (PCI DSS) to ensure your security and privacy. We conduct regular vulnerability scans and penetration tests in accordance with the PCI DSS requirements for our business mode
          </div>
        </div>
      </div>
    </div>
  )
}
