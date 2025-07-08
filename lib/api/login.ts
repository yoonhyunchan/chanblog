import type { User, LoginPayload, LoginResponse, RegisterPayload } from "@/lib/types/login";
const LOGIN_API = process.env.NEXT_PUBLIC_LOGIN_API_URL

export function getAuthHeaders(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    const token = localStorage.getItem('authToken');
    const tokenType = localStorage.getItem('tokenType');

    if (!token || !tokenType) return {};

    return {
        'Authorization': `${tokenType} ${token}`
    };
}

export async function loginUser({ email, password }: LoginPayload): Promise<LoginResponse> {
    const response = await fetch(`${LOGIN_API}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
    }

    return data;
}

export async function fetchUserData(): Promise<User | null> {
    if (!LOGIN_API) {
        throw new Error('LOGIN_API URL is not defined');
    }

    const headers = getAuthHeaders();

    if (Object.keys(headers).length === 0) {
        throw new Error('No authorization token found');
    }

    const response = await fetch(`${LOGIN_API}/auth/user_data`, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const data = await response.json();
    return data as User;
}
export async function registerUser(payload: RegisterPayload): Promise<LoginResponse> {
    const response = await fetch(`${LOGIN_API}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
    }

    return data;
}

export async function updateUserData(updatedData: Partial<User>): Promise<User> {
    if (!LOGIN_API) {
        throw new Error('LOGIN_API URL is not defined');
    }

    const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
    };

    if (Object.keys(headers).length === 0) {
        throw new Error('No authorization token found');
    }

    const response = await fetch(`${LOGIN_API}/auth/user_data`, {
        method: 'PUT', // or 'PATCH' depending on API spec
        headers,
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update user data: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data as User;
}