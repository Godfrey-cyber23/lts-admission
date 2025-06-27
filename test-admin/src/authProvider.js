import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import jwtDecode from 'jwt-decode';

export default {
    // Called when the user attempts to log in
    login: async ({ username, password }) => {
        const request = new Request('http://localhost:3000/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        
        try {
            const response = await fetch(request);
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            const { token } = await response.json();
            
            // Store the token in local storage
            localStorage.setItem('token', token);
            
            // Decode token to get user info
            const decoded = jwtDecode(token);
            localStorage.setItem('role', decoded.role);
            
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },

    // Called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return Promise.resolve();
    },

    // Called when the API returns an error
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            return Promise.reject();
        }
        return Promise.resolve();
    },

    // Called when the user navigates to a new location
    checkAuth: () => {
        return localStorage.getItem('token')
            ? Promise.resolve()
            : Promise.reject();
    },

    // Called when the user navigates to a new location
    getPermissions: () => {
        const role = localStorage.getItem('role');
        return role ? Promise.resolve(role) : Promise.reject();
    },
};