"use client"
import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import AutofillPage from './pages/AutofillPage'
import { getProfile } from '../services/localProfile'
import { Spinner } from './components/Spinner'

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
  if (!ready) return <Spinner />
  return hasEmail ? <AutofillPage/> : <LandingPage onAuthStateChange={() => { setHasEmail(true) }} />
}

export default LandingGate


