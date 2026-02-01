import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

// 로그인 (세션 생성)
export const login = async (username, password) => {
    try {
        const response = await api.post('/api/auth/login', { username, password });
        const token = response.data.token;

        console.log("Server Response:", response.data);
        localStorage.setItem('token', token); // 토큰 저장

        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);

        return { token, isAdmin: decoded.isAdmin };
    } catch (error) {
        console.error("Login error:", error);
        throw new Error("Login failed");
    }
};

// 로그아웃 (세션 삭제)
export const logout = async () => {
  await api.post('/api/auth/logout');
};

// 회원가입
export const register = async (email, password, name) => {
    try {
        await api.post('/api/user/register', { email, password, name });
    } catch (error) {
        console.error("Registration error:", error);
        throw new Error("Failed to register");
    }
};

// 관리자 여부 확인 (선택적으로 사용)
export const getIsAdmin = async () => {
  try {
    const response = await api.get('/api/auth/check');
    return response.data.isAdmin === true;
  } catch (error) {
    console.error('Admin check failed:', error);
    return false;
  }
};
