import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ToastContainer from './components/ToastContainer.jsx'
import { initAnalytics, trackPage } from './lib/analytics.js'
import AdminPage from './pages/AdminPage.jsx'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/product/:id', element: <ProductDetailPage /> },
			{ path: '/cart', element: <CartPage /> },
			{ path: '/checkout', element: <CheckoutPage /> },
			{ path: '/login', element: <LoginPage /> },
			{ path: '/register', element: <RegisterPage /> },
			{ path: '/orders', element: <OrdersPage /> },
			{ path: '/admin', element: <AdminPage /> },
		],
	},
])

initAnalytics(import.meta.env.VITE_GA_ID)

router.subscribe((state) => {
	const { location } = state
	trackPage(location.pathname + location.search)
})

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ToastProvider>
			<AuthProvider>
				<ProductProvider>
					<CartProvider>
						<RouterProvider router={router} />
						<ToastContainer />
					</CartProvider>
				</ProductProvider>
			</AuthProvider>
		</ToastProvider>
	</StrictMode>,
)
