// Fixed version with missing handlers and scoped functions
'use client'

import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function EditUserPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [user, setUser] = useState<Linkny>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/sign-in')
      return
    }

    fetch(`/api/admin/users/${id}`)
      .then(res => res.json())
      .then(setUser)
      .finally(() => setLoading(false))
  }, [status, session, id])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setUser((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    setSaving(false)
    alert('User saved!')
  }

  const handleAddActivity = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    const res = await fetch(`/api/admin/users/${id}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: formData.get('type'),
        description: formData.get('description'),
        date: formData.get('date'),
        tradeId: formData.get('tradeId'),
        commissionFee: parseFloat(formData.get('commissionFee') as string),
        amount: parseFloat(formData.get('amount') as string),
      })
    })

    if (res.ok) location.reload()
    else alert('Error saving activity')
  }

  const handleDelete = async (activityId: string) => {
    const confirmDelete = confirm('Delete this activity?')
    if (!confirmDelete) return
    await fetch(`/api/admin/activities/${activityId}`, { method: 'DELETE' })
    location.reload()
  }

  if (loading) return <div className="text-white p-8">Loading user...</div>
  if (!user) return <div className="text-white p-8">User not found</div>

  const activities = user.activities || []

  const earnings = activities.filter(a => a.type === 'earning').reduce((sum, a) => sum + a.amount, 0)
  const deposits = activities.filter(a => a.type === 'deposit').reduce((sum, a) => sum + a.amount, 0)
  const withdrawals = activities.filter(a => a.type === 'withdrawal').reduce((sum, a) => sum + a.amount, 0)
  const netCapital = deposits - withdrawals

  const estimatedYield = netCapital > 0 ? ((earnings / netCapital) * 100).toFixed(2) : '0.00'
  const maxRisk = activities.length > 0 ? (activities.reduce((acc, a) => acc + Math.abs(a.amount), 0) / activities.length).toFixed(2) : '0.00'
  const accountType = user.accountType || 'Standard'
  const createdOn = activities.length > 0 ? new Date(activities[0].date).toLocaleDateString() : new Date(user.createdAt).toLocaleDateString()

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
        <div className="page-header-text">Edit user</div>
        <Image src="/images/Ellipse-123.svg" loading="lazy" width={28} height={28} alt="" className="ellipse-123" />
        <Image src="/images/nebula-dashboard-icon.png" loading="eager" alt="" className="dashboard-icon-mobile" />
      </div>
      <div className="page-container">
        <div className="side-menu">
          <Link href="/admin/users" className="menu-btn">
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
                <div className="display-text">Editing {user.firstName} {user.lastName}</div>
                <div className="text-m-muted">User ID: {user.id.slice(0, 12)}...</div>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-container">
              <div className="text-m-muted">Balance</div>
              <div className="text-m">${(user.portfolioBalance || 0).toFixed(2)}</div>
            </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">All time earnings</div>
              <div className="text-m">${earnings.toFixed(2)}</div>
            </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">Estimated yield</div>
              <div className="text-m">{estimatedYield}%</div>
            </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">Maximum risk</div>
              <div className="text-m">{maxRisk}%</div>
            </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">Account type</div>
              <div className="text-m">{accountType}</div>
            </div>
            <div className="stats-divider" />
            <div className="stats-container">
              <div className="text-m-muted">Created on</div>
              <div className="text-m">{createdOn}</div>
            </div>
          </div>

          <div className="card">
            <div className="display-text-sm">Personal data</div>
            <div className="flex col-gap-12 mb-16">
              <div className="full-width">
                <div className="form-label">First name</div>
                <input className="form-input" name="firstName" value={user.firstName} onChange={handleChange} />
              </div>
              <div className="full-width">
                <div className="form-label">Last name</div>
                <input className="form-input" name="lastName" value={user.lastName} onChange={handleChange} />
              </div>
            </div>
            <div className="flex col-gap-12 mb-16">
              <div className="full-width">
                <div className="form-label">Email</div>
                <input className="form-input" name="email" value={user.email} onChange={handleChange} />
              </div>
              <div className="full-width">
                <div className="form-label">Mobile number</div>
                <input className="form-input" name="mobileNumber" value={user.mobileNumber} onChange={handleChange} />
              </div>
            </div>
            <div className="flex col-gap-12 mb-16">
              <button className="btn-white" onClick={handleSave} disabled={saving}>
                <div>{saving ? 'Saving...' : 'Save changes'}</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleAddActivity} className="card">
            <div className="display-text-sm">Add new earning</div>

            <div className="flex col-gap-12 mb-16">
              <div className="full-width">
                <div className="form-label">Type</div>
                <select name="type" className="form-input" required>
                  <option value="earning">Earning</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>

              <div className="full-width">
                <div className="form-label">Description</div>
                <input
                  className="form-input"
                  name="description"
                  placeholder="Description"
                  required
                />
              </div>

              <div className="full-width">
                <div className="form-label">Date</div>
                <input
                  className="form-input"
                  name="date"
                  type="datetime-local"
                  required
                />
              </div>
            </div>

            <div className="flex col-gap-12 mb-16">
              <div className="full-width">
                <div className="form-label">Trade ID</div>
                <input
                  className="form-input"
                  name="tradeId"
                  placeholder="Trade ID"
                  required
                />
              </div>

              <div className="full-width">
                <div className="form-label">Commission Fee</div>
                <input
                  className="form-input"
                  name="commissionFee"
                  type="number"
                  step="0.01"
                  placeholder="Fee"
                  required
                />
              </div>

              <div className="full-width">
                <div className="form-label">Amount</div>
                <input
                  className="form-input"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  required
                />
              </div>
            </div>

            <div className="flex col-gap-12 mb-16">
              <button type="submit" className="btn-white">
                <div>Add</div>
              </button>
            </div>
          </form>


          <div className="card">
            <div className="flex space-between">
              <div className="display-text-sm">Recent activity</div>
            </div>
            <div className="earnings-list">
              <div className="earnings-ltable-header">
                <div className="text-m-muted">Type</div>
                <div className="text-m-muted">Description</div>
                <div className="text-m-muted">Date</div>
                <div className="text-m-muted">Trade ID</div>
                <div className="text-m-muted">Fee</div>
                <div className="flex col-gap-12 align-y-center align-x-right">
                  <div className="text-m-muted">Amount</div>
                </div>
                <div className="grid-spacer"></div>
              </div>
              {activities.map((a: any, idx: number) => (
                <div className={`earnings-li ${idx === activities.length - 1 ? 'last' : ''}`} key={a.id}>
                  <div className="text-m capital">{a.type}</div>
                  <div className="text-m">{a.description}</div>
                  <div className="text-m">{new Date(a.date).toLocaleDateString()}</div>
                  <div className="text-m">{a.tradeId}</div>
                  <div className="text-m">-${a.commissionFee.toFixed(2)}</div>
                  <div className="flex col-gap-12 align-y-center align-x-right">
                    <div className={`text-m ${a.amount >= 0 ? 'profit' : 'loss'}`}>
                      {a.amount >= 0 ? '+' : '-'}${Math.abs(a.amount).toFixed(2)}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(a.id)} className="btn-critical">
                    <div>Delete</div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
