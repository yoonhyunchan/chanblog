function getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType');

    if (!token || !tokenType) return {};

    return {
        'Authorization': `${tokenType} ${token}`
    };
}