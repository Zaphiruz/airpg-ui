export const titleCase = (s) => {
	return (s?.substring(0,1).toUpperCase() + s?.substring(1).toLowerCase()) ?? '';
}

export const getRequestFormat = (url, params = {}) => {
	return Object.entries(params).reduce((host, [key, value]) => (
		value && (
			(host == url)
			? host += `?${key}=${value}`
			: host += `&${key}=${value}`
		),
		host), url)
}