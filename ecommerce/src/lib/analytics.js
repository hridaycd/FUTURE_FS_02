let initialized = false

export function initAnalytics(gaMeasurementId) {
	if (initialized || !gaMeasurementId) return
	// gtag.js
	const script1 = document.createElement('script')
	script1.async = true
	script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`
	document.head.appendChild(script1)

	const script2 = document.createElement('script')
	script2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaMeasurementId}', { send_page_view: false });`
	document.head.appendChild(script2)

	initialized = true
}

export function trackPage(path) {
	if (!initialized || !window.gtag) return
	window.gtag('event', 'page_view', {
		page_path: path,
	})
}

export function trackEvent(action, params = {}) {
	if (!initialized || !window.gtag) return
	window.gtag('event', action, params)
}


