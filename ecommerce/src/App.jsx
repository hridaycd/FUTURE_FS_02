import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

function App() {
	const { user, logout } = useAuth()
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b">
				<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
					<Link to="/" className="text-xl font-semibold">MiniShop</Link>
					<nav className="flex items-center gap-6">
						<NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Home</NavLink>
						<NavLink to="/cart" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Cart</NavLink>
						{user ? (
							<>
								<NavLink to="/orders" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Orders</NavLink>
								<NavLink to="/admin" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Admin</NavLink>
								<button onClick={logout} className="text-gray-700">Logout</button>
							</>
						) : (
							<>
								<NavLink to="/login" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Login</NavLink>
								<NavLink to="/register" className={({ isActive }) => isActive ? 'text-blue-600' : 'text-gray-700'}>Register</NavLink>
							</>
						)}
					</nav>
				</div>
			</header>
			<main className="flex-1">
				<div className="max-w-6xl mx-auto px-4 py-6">
					<Outlet />
				</div>
			</main>
			<footer className="border-t">
				<div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500">© {new Date().getFullYear()} MiniShop</div>
			</footer>
		</div>
	)
}

export default App
