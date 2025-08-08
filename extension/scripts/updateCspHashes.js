const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

function computeHashes(html) {
  const hashes = new Set()
  const scriptRegex = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = scriptRegex.exec(html)) !== null) {
    const content = (match[1] || '').trim()
    if (!content) continue
    const hash = crypto.createHash('sha256').update(content).digest('base64')
    hashes.add(`'sha256-${hash}'`)
  }
  return Array.from(hashes)
}

function main() {
  const outDir = path.join(__dirname, '..', 'out')
  const popupPath = path.join(outDir, 'popup.html')
  const manifestPath = path.join(outDir, 'manifest.json')
  if (!fs.existsSync(popupPath) || !fs.existsSync(manifestPath)) {
    console.error('Missing out/popup.html or out/manifest.json')
    process.exit(1)
  }
  const html = fs.readFileSync(popupPath, 'utf8')
  const hashes = computeHashes(html)
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const base = ["'self'", "'wasm-unsafe-eval'"]
  const policy = `script-src ${base.concat(hashes).join(' ')}; object-src 'self'`
  manifest.content_security_policy = policy
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log('Updated CSP with hashes:', hashes)
}

main()


