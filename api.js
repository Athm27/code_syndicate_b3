// API Service for backend communication
const API_URL = 'http://localhost:3000/api';

const ApiService = {
    // Token management
    getToken() {
        return localStorage.getItem('token');
    },

    setToken(token) {
        localStorage.setItem('token', token);
    },

    clearToken() {
        localStorage.removeItem('token');
    },

    // Headers with authentication
    getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    },

    // Authentication
    async login(username, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success && data.token) {
                this.setToken(data.token);
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (data.success && data.token) {
                this.setToken(data.token);
            }
            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    // Users
    async getUsers() {
        try {
            const response = await fetch(`${API_URL}/users`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Get users error:', error);
            throw error;
        }
    },

    // Medicines
    async getMedicines(patientId) {
        try {
            const response = await fetch(`${API_URL}/medicines?patientId=${patientId}`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Get medicines error:', error);
            throw error;
        }
    },

    async addMedicine(medicineData) {
        try {
            const response = await fetch(`${API_URL}/medicines`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(medicineData)
            });
            return await response.json();
        } catch (error) {
            console.error('Add medicine error:', error);
            throw error;
        }
    },

    // Reminders
    async getReminders(patientId) {
        try {
            const response = await fetch(`${API_URL}/reminders?patientId=${patientId}`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Get reminders error:', error);
            throw error;
        }
    },

    async addReminder(reminderData) {
        try {
            const response = await fetch(`${API_URL}/reminders`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(reminderData)
            });
            return await response.json();
        } catch (error) {
            console.error('Add reminder error:', error);
            throw error;
        }
    },

    // Blood Bank
    async getBloodBankStatus() {
        try {
            const response = await fetch(`${API_URL}/blood-bank/status`, {
                headers: this.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Get blood bank status error:', error);
            throw error;
        }
    },

    async requestBloodDonation(requestData) {
        try {
            const response = await fetch(`${API_URL}/blood-bank/request`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(requestData)
            });
            return await response.json();
        } catch (error) {
            console.error('Request blood donation error:', error);
            throw error;
        }
    },

    // Error handling
    handleError(error) {
        if (error.status === 401) {
            this.clearToken();
            // Redirect to login page or show authentication error
            window.location.href = '/login';
        }
        throw error;
    }
}; 