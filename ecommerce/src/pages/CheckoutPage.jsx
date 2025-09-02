import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function CheckoutPage() {
	const { items, subtotal, clearCart } = useCart()
	const { user, addOrder } = useAuth()
	const { show } = useToast()
	const navigate = useNavigate()
	const [placing, setPlacing] = useState(false)
	const [orderId, setOrderId] = useState(null)
	const [form, setForm] = useState({
		name: '',
		email: '',
		address: '',
		city: '',
		zip: '',
		payment: 'cod',
	})
	const [errors, setErrors] = useState({})

	useEffect(() => {
		if (items.length === 0 && !orderId) {
			navigate('/')
		}
	}, [items.length, orderId, navigate])

	const total = useMemo(() => subtotal, [subtotal])

	function handleChange(e) {
		const { name, value } = e.target
		setForm((f) => ({ ...f, [name]: value }))
	}

	function validate() {
		const next = {}
		if (!form.name.trim()) next.name = 'Required'
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email'
		if (!form.address.trim()) next.address = 'Required'
		if (!form.city.trim()) next.city = 'Required'
		if (!/^\d{4,10}$/.test(form.zip)) next.zip = 'Invalid ZIP'
		setErrors(next)
		return Object.keys(next).length === 0
	}

	async function handleSubmit(e) {
		e.preventDefault()
		if (!validate()) return
		setPlacing(true)
		await new Promise((r) => setTimeout(r, 800))
		const oid = Math.random().toString(36).slice(2, 10).toUpperCase()
		setOrderId(oid)
		if (user) {
			addOrder({ id: oid, items, total, createdAt: Date.now() })
		}
		clearCart()
		show('Order placed', { type: 'success' })
		setPlacing(false)
	}

	if (orderId) {
		return (
			<div className="space-y-4">
				<h1 className="text-2xl font-semibold">Order Confirmed</h1>
				<p className="text-gray-600">Thank you! Your order <span className="font-medium">#{orderId}</span> has been placed.</p>
				<button onClick={() => navigate('/')} className="px-4 py-2 border rounded">Back to Home</button>
			</div>
		)
	}

	return (
		<div className="grid md:grid-cols-3 gap-8">
			<form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
				<h1 className="text-2xl font-semibold">Checkout</h1>
				<div className="grid sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm mb-1">Name</label>
						<input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
						{errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
					</div>
					<div>
						<label className="block text-sm mb-1">Email</label>
						<input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
						{errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
					</div>
					<div className="sm:col-span-2">
						<label className="block text-sm mb-1">Address</label>
						<input name="address" value={form.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
						{errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
					</div>
					<div>
						<label className="block text-sm mb-1">City</label>
						<input name="city" value={form.city} onChange={handleChange} className="w-full border rounded px-3 py-2" />
						{errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
					</div>
					<div>
						<label className="block text-sm mb-1">ZIP</label>
						<input name="zip" value={form.zip} onChange={handleChange} className="w-full border rounded px-3 py-2" />
						{errors.zip && <p className="text-sm text-red-600">{errors.zip}</p>}
					</div>
					<div className="sm:col-span-2">
						<label className="block text-sm mb-1">Payment</label>
						<select name="payment" value={form.payment} onChange={handleChange} className="w-full border rounded px-3 py-2">
							<option value="cod">Cash on Delivery</option>
							<option value="card">Credit/Debit Card (simulated)</option>
						</select>
					</div>
				</div>
				<button disabled={placing} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
					{placing ? 'Placing order…' : 'Place Order'}
				</button>
			</form>
			<aside className="border rounded p-4 h-fit space-y-3">
				<h2 className="font-medium">Order Summary</h2>
				<div className="space-y-2">
					{items.map((i) => (
						<div key={i.id} className="flex justify-between text-sm">
							<span className="truncate mr-2">{i.title} × {i.quantity}</span>
							<span>${(i.price * i.quantity).toFixed(2)}</span>
						</div>
					))}
				</div>
				<div className="flex justify-between font-medium">
					<span>Subtotal</span>
					<span>${total}</span>
				</div>
			</aside>
		</div>
	)
}


