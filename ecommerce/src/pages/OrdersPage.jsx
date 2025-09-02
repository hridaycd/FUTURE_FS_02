import { useAuth } from '../context/AuthContext.jsx'

export default function OrdersPage() {
	const { user, orders } = useAuth()
	if (!user) return <p>Please login to view your orders.</p>
	if (orders.length === 0) return <p>No orders yet.</p>
	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-semibold">Your Orders</h1>
			<div className="space-y-4">
				{orders.map((o) => (
					<div key={o.id} className="border rounded p-4">
						<div className="flex justify-between mb-2">
							<span className="font-medium">Order #{o.id}</span>
							<span className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</span>
						</div>
						<div className="space-y-1 text-sm">
							{o.items.map((i) => (
								<div key={i.id} className="flex justify-between">
									<span className="truncate mr-2">{i.title} × {i.quantity}</span>
									<span>${(i.price * i.quantity).toFixed(2)}</span>
								</div>
							))}
						</div>
						<div className="flex justify-between mt-3 font-medium">
							<span>Total</span>
							<span>${o.total.toFixed(2)}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
