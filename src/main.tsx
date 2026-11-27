import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './style.css'

async function start() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { worker } = await import('./apis/mocks/browser')
    await worker.start()
  }
  createRoot(document.getElementById('app')!).render(<StrictMode><App /></StrictMode>)
}
void start().catch(error => {
  console.error('Application startup failed', error)
  document.getElementById('app')!.textContent = 'Could not start the application. Check the browser console.'
})
