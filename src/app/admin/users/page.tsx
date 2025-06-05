'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    const role = session?.user?.role

    if (!role) return

    if (role !== 'ADMIN') {
      router.replace('/dashboard')
      return
    }

    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching users:', error)
        setLoading(false)
      })
  }, [status, session, router])

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="page-header">
        <Image src="/images/nebula-dashboard-icon.png" loading="eager" alt="" className="dashboard-icon-desktop" />
        <div className="mobile-menu-btn">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.6882 20.3262L10.3343 20.3262" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M20.6882 15.3262L10.3343 15.3262" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M20.6882 10.3262L10.3343 10.3262" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="page-header-text">Admin</div>
        <div className="breadcrumbs-slash">
          <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.03857 2.09277L1.96153 11.9074" stroke="#2F2F2F" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="page-header-text">Users</div>
        <Image src="/images/Ellipse-123.svg" loading="lazy" width={28} height={28} alt="" className="ellipse-123" />
        <Image src="/images/nebula-dashboard-icon.png" loading="eager" alt="" className="dashboard-icon-mobile" />
      </div>
      <div className="page-container">
        <div className="side-menu">
          <Link href="/admin/users" className="menu-btn w--current">
            <div className="btn-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.4384 4.15572C10.4384 5.45958 9.34653 6.5166 7.99911 6.5166C6.65169 6.5166 5.55981 5.45958 5.55981 4.15572C5.55981 2.85186 6.65169 1.79541 7.99911 1.79541C9.34653 1.79541 10.4384 2.85244 10.4384 4.15572Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.0336 13.9722V12.3761C13.0336 10.4983 11.5114 8.97607 9.63361 8.97607H6.36826C4.49049 8.97607 2.96826 10.4983 2.96826 12.3761V13.9722" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>Users</div>
          </Link>
          <button className="menu-btn last" onClick={() => router.push('/sign-in')}>
            <div className="btn-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.48657 9.09034L6.19078 4.84375M2.48657 9.08839L6.19077 13.335" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2.48657 9.09041L8.31598 9.09041C11.1864 9.09041 13.5133 6.76348 13.5133 3.89307V3.89307" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>Sign out</div>
          </button>
        </div>

        <div className="admin-page-card">
          <div className="flex space-between mb-16">
            <div className="flex dynamic-col-gap-1">
              <div className="div">
                <div className="display-text">Users</div>
                <div className="text-m-muted">Manage user accounts · {users.length} users</div>
              </div>
            </div>
          </div>

          <div className="user-list">
            <div className="users-table-header">
              <div className="text-m-muted">User ID</div>
              <div className="text-m-muted">Name</div>
              <div className="text-m-muted">Email</div>
              <div className="text-m-muted">Number</div>
              <div className="text-m-muted">Balance</div>
              <div className="text-m-muted">Profit</div>
            </div>
            {users.map(user => (
              <div className="users-table-li hover" key={user.id} onClick={() => router.push(`/admin/users/${user.id}`)}>
                <div className="text-m">{user.id.slice(0, 10)}...</div>
                <div className="text-m">{user.firstName} {user.lastName}</div>
                <div className="text-m">{user.email}</div>
                <div className="text-m">{user.mobileNumber}</div>
                <div className="text-m">${(user.portfolioBalance || 0).toFixed(2)}</div>
                <div className="text-m">${(user.allTimeEarnings || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
