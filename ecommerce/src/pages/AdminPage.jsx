import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function AdminPage() {
	const { user } = useAuth()
	const navigate = useNavigate()
	const { localProducts, addLocalProduct, updateLocalProduct, deleteLocalProduct } = useProducts()
	const { show } = useToast()
	const [editingId, setEditingId] = useState(null)
	const [form, setForm] = useState({ title: '', description: '', price: 0, category: 'misc', image: '' })

	if (!user) {
		return (
			<div>
				<p className="mb-3">Please login to access Admin.</p>
				<button onClick={() => navigate('/login')} className="px-4 py-2 border rounded">Go to Login</button>
			</div>
		)
	}

	function startEdit(p) {
		setEditingId(p.id)
		setForm({ title: p.title, description: p.description, price: p.price, category: p.category, image: p.image })
	}

	function resetForm() {
		setEditingId(null)
		setForm({ title: '', description: '', price: 0, category: 'misc', image: '' })
	}

	function handleChange(e) {
		const { name, value } = e.target
		setForm((f) => ({ ...f, [name]: name === 'price' ? Number(value) : value }))
	}

	function handleSubmit(e) {
		e.preventDefault()
		if (!form.title.trim()) return show('Title is required', { type: 'error' })
		if (editingId) {
			updateLocalProduct(editingId, form)
			show('Product updated', { type: 'success' })
		} else {
			const id = addLocalProduct(form)
			show('Product created', { type: 'success' })
			// Optionally jump to detail
		}
		resetForm()
	}

	return (
		<div className="grid md:grid-cols-2 gap-8">
			<div>
				<h1 className="text-2xl font-semibold mb-4">Admin: Products</h1>
				<form onSubmit={handleSubmit} className="space-y-3">
					<input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" />
					<input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="w-full border rounded px-3 py-2" />
					<input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" />
					<input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2" />
					<textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
					<div className="flex gap-2">
						<button className="px-4 py-2 bg-blue-600 text-white rounded">{editingId ? 'Update' : 'Create'}</button>
						{editingId && <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Cancel</button>}
					</div>
				</form>
			</div>
			<div>
				<h2 className="text-xl font-medium mb-4">Local Products</h2>
				<div className="space-y-3">
					{localProducts.length === 0 && <p className="text-gray-600">No local products yet.</p>}
					{localProducts.map((p) => (
						<div key={p.id} className="border rounded p-3 flex gap-3 items-center">
							<img src={p.image} alt={p.title} className="w-16 h-16 object-contain bg-white" />
							<div className="flex-1 min-w-0">
								<div className="font-medium truncate">{p.title}</div>
								<div className="text-sm text-gray-500">${p.price} · {p.category}</div>
							</div>
							<div className="flex gap-2">
								<button onClick={() => startEdit(p)} className="px-3 py-1 border rounded">Edit</button>
								<button onClick={() => { deleteLocalProduct(p.id); show('Deleted', { type: 'success' }) }} className="px-3 py-1 border rounded text-red-600">Delete</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}


