import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EmailApp from './EmailApp'
import WebsiteApp from './website/App'

function App() {
  return (
    <BrowserRouter>
      <span className="material-icons-outlined" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden>inbox</span>
      <Routes>
        <Route path="/email/*" element={<EmailApp />} />
        <Route path="*" element={<WebsiteApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
