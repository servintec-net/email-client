import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ProductsPage from './pages/ProductsPage'
import ServicesPage from './pages/ServicesPage'
import FaqPage from './pages/FaqPage'
import FreeWallPage from './pages/FreeWallPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsConditionsPage from './pages/TermsConditionsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function WebsiteApp() {
  return (
    <main className="font-sans" style={{ fontFamily: "'Inter', 'Manrope', sans-serif" }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/freewall" element={<FreeWallPage />} />
        <Route path="/freewall/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/freewall/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  )
}
