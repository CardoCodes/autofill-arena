// Ambient declarations so TS accepts both Chrome and Firefox globals in UI code
// without requiring @types/chrome (we rely on runtime checks or wrappers).

/* eslint-disable @typescript-eslint/no-explicit-any */

declare const chrome: any
declare const browser: any


