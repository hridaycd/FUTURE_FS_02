import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function RegisterPage() {
	const { register } = useAuth()
	const navigate = useNavigate()
	const { show } = useToast()
	const [form, setForm] = useState({ name: '', email: '', password: '' })
	const [error, setError] = useState('')

	function handleChange(e) {
		const { name, value } = e.target
		setForm((f) => ({ ...f, [name]: value }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		setError('')
		try {
			if (!form.name.trim()) throw new Error('Name required')
			register(form)
			show('Account created', { type: 'success' })
			navigate('/')
		} catch (err) {
			const msg = err.message || 'Registration failed'
			setError(msg)
			show(msg, { type: 'error' })
		}
	}

	return (
		<div className="max-w-sm mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Register</h1>
			<form onSubmit={handleSubmit} className="space-y-3">
				<input name="name" placeholder="Full name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
				<input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
				<input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2" />
				{error && <p className="text-sm text-red-600">{error}</p>}
				<button className="w-full px-4 py-2 bg-blue-600 text-white rounded">Create account</button>
			</form>
			<p className="text-sm text-gray-600 mt-3">Have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
		</div>
	)
}


