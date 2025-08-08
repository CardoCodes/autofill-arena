;(function(){
  const status = document.getElementById('status')
  const fullName = document.getElementById('fullName')
  const email = document.getElementById('email')
  const phone = document.getElementById('phone')
  const btnSave = document.getElementById('save')
  const btnFill = document.getElementById('autofill')

  function setStatus(t){ status.textContent = t }

  async function getApiBase(){
    try { const resp = await chrome.runtime.sendMessage({ type: 'getApiBase' }); return resp?.apiBase || 'http://localhost:5123' } catch { return 'http://localhost:5123' }
  }

  async function loadProfile(){
    setStatus('Loading profile...')
    try {
      const base = await getApiBase()
      const res = await fetch(base + '/profile')
      const { profile } = await res.json()
      if (profile){
        fullName.value = profile.full_name || ''
        email.value = profile.email || ''
        phone.value = profile.phone || ''
      }
      setStatus('')
    } catch { setStatus('Offline mode: enter details and save') }
  }

  async function saveProfile(){
    try {
      const base = await getApiBase()
      await fetch(base + '/profile', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ profile: { full_name: fullName.value, email: email.value, phone: phone.value } }) })
      setStatus('Saved')
    } catch { setStatus('Save failed') }
  }

  async function triggerAutofill(){
    try {
      const tabs = await chrome.tabs.query({ active:true, currentWindow:true })
      if (tabs[0]?.id) await chrome.tabs.sendMessage(tabs[0].id, { action:'scanAndFill' })
      setStatus('Triggered autofill')
    } catch { setStatus('Cannot trigger autofill') }
  }

  btnSave.addEventListener('click', saveProfile)
  btnFill.addEventListener('click', triggerAutofill)
  loadProfile()
})()


