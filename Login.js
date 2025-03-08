// Login component
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        };
    }

    template() {
        return `
            <div class="min-h-screen flex items-center justify-center">
                <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h1 class="text-2xl font-bold text-center mb-6 text-blue-600">MediRemind</h1>
                    <h2 class="text-xl font-semibold text-center mb-6">Login</h2>
                    
                    ${this.state.error ? `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">${this.state.error}</div>` : ''}
                    
                    <form id="login-form" class="space-y-4">
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
                        <div class="flex items-center justify-between">
                            <button 
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="submit"
                            >
                                Sign In
                            </button>
                            <button 
                                id="register-btn"
                                class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" 
                                type="button"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                    
                    <div class="mt-8 border-t pt-4">
                        <h3 class="text-sm font-semibold text-gray-600 mb-2">Demo Accounts:</h3>
                        <div class="grid grid-cols-3 gap-2 text-xs">
                            <div class="bg-blue-50 p-2 rounded">
                                <p class="font-bold">Patient</p>
                                <p>Username: patient1</p>
                                <p>Password: password</p>
                            </div>
                            <div class="bg-green-50 p-2 rounded">
                                <p class="font-bold">Caretaker</p>
                                <p>Username: caretaker1</p>
                                <p>Password: password</p>
                            </div>
                            <div class="bg-purple-50 p-2 rounded">
                                <p class="font-bold">Doctor</p>
                                <p>Username: doctor1</p>
                                <p>Password: password</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Add event listeners
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('register-btn').addEventListener('click', () => {
            this.navigate('Register');
        });

        // Add input event listeners
        document.getElementById('username').addEventListener('input', (e) => {
            this.setState({ username: e.target.value });
        });

        document.getElementById('password').addEventListener('input', (e) => {
            this.setState({ password: e.target.value });
        });
    }

    handleLogin() {
        const { username, password } = this.state;
        
        if (!username || !password) {
            this.setState({ error: 'Please enter both username and password' });
            return;
        }
        
        const user = Store.login(username, password);
        
        if (user) {
            // Navigate to appropriate dashboard based on role
            switch (user.role) {
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
            this.setState({ error: 'Invalid username or password' });
        }
    }
} 