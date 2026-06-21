import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Store from './pages/Store'
import Products from './pages/Products'
import Wiki from './pages/Wiki'
import Support from './pages/Support'
import Gelistirme from './pages/Gelistirme'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProductDetail from './pages/ProductDetail'
import StoreProductDetail from './pages/StoreProductDetail'
import CheckoutPage from './pages/CheckoutPage'
import AuthCallback from './pages/AuthCallback'
import NotFound from './pages/NotFound'
import ScrollProgressBar from './components/ScrollProgressBar'
import CursorGlow from './components/CursorGlow'
import BackToTop from './components/BackToTop'
import CommandPalette from './components/CommandPalette'
import CookieConsent from './components/CookieConsent'
import PageTransition from './components/PageTransition'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ToastContainer'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppContent() {
  const location = useLocation()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <ScrollProgressBar />
      <Header />
      <CursorGlow />
      <main style={{ flex: 1 }}>
        <PageTransition location={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/magaza" element={<Store />} />
            <Route path="/urunler" element={<Products />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/destek" element={<Support />} />
            <Route path="/gelistirme" element={<Gelistirme />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/store/:slug" element={<StoreProductDetail />} />
            <Route path="/checkout/:slug" element={<CheckoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      <BackToTop />
      <ToastContainer />
      <CommandPalette />
      <Footer />
      <CookieConsent />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
        <CartProvider>
          <ToastProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
          </ToastProvider>
        </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
