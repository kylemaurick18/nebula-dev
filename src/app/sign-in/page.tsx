'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError(res.error)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="auth-card-container">
      <div className="auth-card">
        <div id="grain" className="auth-card-graphics-container">
          <Image
            width={383}
            height={581}
            src="/images/login-graphics.webp"
            alt=""
            className="auth-graphics"
          />
          <Image
            width={292}
            height={100}
            src="/images/login-graphics-mobile.webp"
            alt=""
            className="auth-graphics-mobile"
          />
        </div>
        <div className="auth-form-container">
          <div>
            <div className="auth-heading">Welcome back</div>
            <div className="auth-sub-text">Sign in to see your activities</div>

            {error && <div className="form-error-msg">{error}</div>}

            <div className="mb-16">
              <div className="form-label">Email</div>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-16">
              <div className="form-label">Password</div>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex space-between">
              <button className="btn-grey" onClick={() => router.push('/sign-up')}>
                <div>Create an account</div>
              </button>
              <button className="btn-white" onClick={handleSubmit}>
                <div>Sign in</div>
                <div className="btn-icon">
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
    </div>
  )
}
