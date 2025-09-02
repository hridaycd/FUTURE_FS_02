import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function CartPage() {
	const { items, setQuantity, removeItem, subtotal, totalItems } = useCart()

	if (items.length === 0) {
		return (
			<div className="space-y-4">
				<h1 className="text-2xl font-semibold">Cart</h1>
				<p className="text-gray-600">Your cart is empty for now.</p>
				<div>
					<Link to="/" className="inline-block px-4 py-2 border rounded">Continue shopping</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="grid md:grid-cols-3 gap-8">
			<div className="md:col-span-2 space-y-4">
				{items.map((i) => (
					<div key={i.id} className="flex gap-4 border rounded p-4 items-center">
						<img src={i.image} alt={i.title} className="w-20 h-20 object-contain bg-white" />
						<div className="flex-1">
							<h3 className="font-medium line-clamp-2">{i.title}</h3>
							<div className="text-sm text-gray-500">${i.price}</div>
						</div>
						<div className="flex items-center gap-2">
							<button onClick={() => setQuantity(i.id, i.quantity - 1)} className="px-3 py-1 border rounded">-</button>
							<input value={i.quantity} onChange={(e) => setQuantity(i.id, Number(e.target.value) || 1)} className="w-12 text-center border rounded py-1" />
							<button onClick={() => setQuantity(i.id, i.quantity + 1)} className="px-3 py-1 border rounded">+</button>
						</div>
						<button onClick={() => removeItem(i.id)} className="text-red-600 text-sm">Remove</button>
					</div>
				))}
			</div>
			<aside className="border rounded p-4 space-y-3 h-fit">
				<div className="flex justify-between">
					<span>Items</span>
					<span>{totalItems}</span>
				</div>
				<div className="flex justify-between font-medium">
					<span>Subtotal</span>
					<span>${subtotal}</span>
				</div>
				<Link to="/checkout" className="block text-center px-4 py-2 bg-blue-600 text-white rounded">Proceed to Checkout</Link>
			</aside>
		</div>
	)
}


