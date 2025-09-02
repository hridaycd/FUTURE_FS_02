import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([])

	const remove = useCallback((id) => {
		setToasts((list) => list.filter((t) => t.id !== id))
	}, [])

	const show = useCallback((message, { type = 'info', duration = 2500 } = {}) => {
		const id = Math.random().toString(36).slice(2, 10)
		setToasts((list) => [...list, { id, message, type }])
		if (duration > 0) setTimeout(() => remove(id), duration)
		return id
	}, [remove])

	const value = useMemo(() => ({ show, remove, toasts }), [show, remove, toasts])

	return (
		<ToastContext.Provider value={value}>
			{children}
		</ToastContext.Provider>
	)
}

export function useToast() {
	const ctx = useContext(ToastContext)
	if (!ctx) throw new Error('useToast must be used within ToastProvider')
	return ctx
}


