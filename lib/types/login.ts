export interface User {
    id: number;
    email: string;
    name: string;
    title: string;
    avatar_path: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
    token_type: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name: string;
    title: string;
    avatar_path: string;
}