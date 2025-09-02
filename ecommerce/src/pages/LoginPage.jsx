import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function LoginPage() {
	const { login } = useAuth()
	const navigate = useNavigate()
	const { show } = useToast()
	const [form, setForm] = useState({ email: '', password: '' })
	const [error, setError] = useState('')

	function handleChange(e) {
		const { name, value } = e.target
		setForm((f) => ({ ...f, [name]: value }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		setError('')
		try {
			login(form)
			show('Logged in', { type: 'success' })
			navigate('/')
		} catch (err) {
			const msg = err.message || 'Login failed'
			setError(msg)
			show(msg, { type: 'error' })
		}
	}

	return (
		<div className="max-w-sm mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Login</h1>
			<form onSubmit={handleSubmit} className="space-y-3">
				<input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
				<input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2" />
				{error && <p className="text-sm text-red-600">{error}</p>}
				<button className="w-full px-4 py-2 bg-blue-600 text-white rounded">Login</button>
			</form>
			<p className="text-sm text-gray-600 mt-3">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
		</div>
	)
}
