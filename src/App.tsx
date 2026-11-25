import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CataloguePage } from './pages/CataloguePage'
import { ProductPage } from './pages/ProductPage'
import { AboutPage } from './pages/AboutPage'
import { GalleryPage } from './pages/GalleryPage'
import { ContactPage } from './pages/ContactPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { ProtectedRoute } from './pages/admin/ProtectedRoute'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="catalogue" element={<CataloguePage />} />
      <Route path="products/:slug" element={<ProductPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="gallery" element={<GalleryPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
    <Route path="admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="products" element={<AdminProductsPage />} />
      <Route path="categories" element={<AdminCategoriesPage />} />
    </Route>
  </Routes>
}
