// Register component
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            role: 'patient',
            error: ''
        };
    }

    template() {
        return `
            <div class="min-h-screen flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 class="text-2xl font-bold text-center mb-6 text-blue-600">MediRemind</h1>
                    <h2 class="text-xl font-semibold text-center mb-6">Register</h2>
                    
                    ${this.state.error ? `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">${this.state.error}</div>` : ''}
                    
                    <form id="register-form" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                                Username
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="username" 
                                type="text" 
                                placeholder="Username"
                                value="${this.state.username}"
                                required
                            >
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                Password
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="password" 
                                type="password" 
                                placeholder="Password"
                                value="${this.state.password}"
                                required
                            >
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm-password">
                                Confirm Password
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="confirm-password" 
                                type="password" 
                                placeholder="Confirm Password"
                                value="${this.state.confirmPassword}"
                                required
                            >
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="role">
                                Role
                            </label>
                            <select 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="role"
                                required
                            >
                                <option value="patient" ${this.state.role === 'patient' ? 'selected' : ''}>Patient</option>
                                <option value="caretaker" ${this.state.role === 'caretaker' ? 'selected' : ''}>Caretaker</option>
                                <option value="doctor" ${this.state.role === 'doctor' ? 'selected' : ''}>Doctor</option>
                            </select>
                        </div>
                        <div class="flex items-center justify-between">
                            <button 
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="submit"
                            >
                                Register
                            </button>
                            <button 
                                id="login-btn"
                                class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" 
                                type="button"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Add event listeners
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        document.getElementById('login-btn').addEventListener('click', () => {
            this.navigate('Login');
        });

        // Add input event listeners
        document.getElementById('username').addEventListener('input', (e) => {
            this.setState({ username: e.target.value });
        });

        document.getElementById('password').addEventListener('input', (e) => {
            this.setState({ password: e.target.value });
        });

        document.getElementById('confirm-password').addEventListener('input', (e) => {
            this.setState({ confirmPassword: e.target.value });
        });

        document.getElementById('role').addEventListener('change', (e) => {
            this.setState({ role: e.target.value });
        });
    }

    handleRegister() {
        const { username, password, confirmPassword, role } = this.state;
        
        // Validate inputs
        if (!username || !password || !confirmPassword) {
            this.setState({ error: 'Please fill in all fields' });
            return;
        }
        
        if (password !== confirmPassword) {
            this.setState({ error: 'Passwords do not match' });
            return;
        }
        
        // Check if username already exists
        const data = Store.getData();
        const existingUser = data.users.find(u => u.username === username);
        
        if (existingUser) {
            this.setState({ error: 'Username already exists' });
            return;
        }
        
        // Register user
        const newUser = Store.register(username, password, role);
        
        if (newUser) {
            // Auto login
            Store.login(username, password);
            
            // Navigate to appropriate dashboard based on role
            switch (role) {
                case 'patient':
                    this.navigate('PatientDashboard');
                    break;
                case 'caretaker':
                    this.navigate('CaretakerDashboard');
                    break;
                case 'doctor':
                    this.navigate('DoctorDashboard');
                    break;
                default:
                    this.setState({ error: 'Invalid user role' });
            }
        } else {
            this.setState({ error: 'Registration failed' });
        }
    }
} 