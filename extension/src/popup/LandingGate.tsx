"use client"
import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import AutofillPage from './pages/AutofillPage'
import { getProfile } from '../services/localProfile'

const LandingGate = () => {
  const [ready, setReady] = useState(false)
  const [hasEmail, setHasEmail] = useState(false)
  useEffect(() => {
    (async () => {
      const p = await getProfile()
      setHasEmail(!!p?.email)
      setReady(true)
    })()
  }, [])
  if (!ready) return <div className="flex items-center justify-center h-[600px] w-[400px] bg-[#282a36]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff79c6]"></div></div>
  return hasEmail ? <AutofillPage/> : <LandingPage onAuthStateChange={() => { setHasEmail(true) }} />
}

export default LandingGate


