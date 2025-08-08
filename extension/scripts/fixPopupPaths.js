const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..', 'out')
const popupPath = path.join(outDir, 'popup.html')

try {
  let html = fs.readFileSync(popupPath, 'utf8')
  html = html.replace(/(href|src)="\/_next\//g, '$1="./_next/')
  fs.writeFileSync(popupPath, html, 'utf8')
  console.log('Rewrote _next asset URLs in popup.html')
} catch (e) {
  console.error('Failed to rewrite popup paths', e)
  process.exit(1)
}


