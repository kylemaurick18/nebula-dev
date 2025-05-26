'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    const res = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to sign up')
      return
    }

    const loginRes = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (loginRes?.error) {
      setError('Signed up, but login failed')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <div id="grain" className="auth-card-graphics-container">
          <Image
            src="/images/login-graphics.webp"
            alt=""
            className="auth-graphics"
          />
          <Image
            src="/images/login-graphics-mobile.webp"
            alt=""
            className="auth-graphics-mobile"
          />
        </div>
        <div className="auth-form-container">
          <div>
            <div className="auth-heading">Create an account</div>
            <div className="auth-sub-text">
              Earn between <span>5–8 % yield per month</span> with Nebula
            </div>

            {error && <div className="form-error-msg">{error}</div>}

            <div className="flex col-gap-12">
              <div className="mb-16 full-width">
                <div className="form-label">First name</div>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-16 full-width">
                <div className="form-label">Last name</div>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-16">
              <div className="form-label">Email</div>
              <input
                type="email"
                name="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-16">
              <div className="form-label">Mobile number</div>
              <input
                type="text"
                name="mobileNumber"
                className="form-input"
                value={form.mobileNumber}
                onChange={handleChange}
              />
            </div>

            <div className="flex col-gap-12">
              <div className="mb-16 full-width">
                <div className="form-label">Password</div>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-16 full-width">
                <div className="form-label">Confirm Password</div>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="auth-disclosure-text">
              By proceeding you agree to Nebula&#39;s Terms and Conditions
            </div>
          </div>

          <div className="flex space-between">
            <button className="btn-grey" onClick={() => router.push('/sign-in')}>
              <div>Already have an account?</div>
            </button>
            <button className="btn-white" onClick={handleSubmit}>
              <div>Sign up</div>
              <div className="btn-icon w-embed">
                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.17584 8.87544L5.41702 5.15967M2.17584 8.87373L5.41702 12.5895" stroke="black" strokeWidth="1.5" strokeLinecap="round"></path>
                  <path d="M2.17578 8.87554L8.64095 8.87554C10.399 8.87554 11.8242 7.45036 11.8242 5.6923V5.6923C11.8242 3.93425 10.399 2.50906 8.64095 2.50906L8.48744 2.50906" stroke="black" strokeWidth="1.5" strokeLinecap="round"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
