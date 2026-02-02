import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EmailApp from './EmailApp'
import WebsiteApp from './website/App'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/email/*" element={<EmailApp />} />
        <Route path="*" element={<WebsiteApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
