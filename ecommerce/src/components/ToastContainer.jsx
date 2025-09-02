import { useToast } from '../context/ToastContext.jsx'

export default function ToastContainer() {
	const { toasts, remove } = useToast()
	return (
		<div className="fixed top-4 right-4 z-50 space-y-2">
			{toasts.map((t) => (
				<div key={t.id} className={`px-4 py-2 rounded shadow text-white ${
					t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
				}`}
					onClick={() => remove(t.id)}
				>
					{t.message}
				</div>
			))}
		</div>
	)
}
