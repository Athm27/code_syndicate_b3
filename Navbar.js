// Navbar component
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: Store.getCurrentUser(),
            showBackButton: props.showBackButton !== false // Default to true unless explicitly set to false
        };
    }

    template() {
        const { currentUser, showBackButton } = this.state;
        
        if (!currentUser) return '';
        
        return `
            <nav class="bg-white shadow-md navbar">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-center py-3">
                        <div class="flex items-center">
                            ${showBackButton ? `
                                <button id="back-btn" class="mr-3 text-gray-600 hover:text-gray-800 clickable">
                                    <i class="fas fa-arrow-left"></i>
                                </button>
                            ` : ''}
                            <span class="text-xl font-bold text-blue-600">MediRemind</span>
                            <span class="ml-2 text-sm bg-${this.getRoleColor(currentUser.role)}-100 text-${this.getRoleColor(currentUser.role)}-800 px-2 py-1 rounded">
                                ${this.capitalizeFirstLetter(currentUser.role)}
                            </span>
                        </div>
                        <div class="flex items-center space-x-4">
                            <span class="text-gray-600">${currentUser.username}</span>
                            <button id="logout-btn" class="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm clickable">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    afterRender() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                this.navigate('Login');
            });
        }
        
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                // Use the goBack method from the Component class
                if (!this.goBack()) {
                    // If there's no history, navigate to the appropriate dashboard
                    const currentUser = Store.getCurrentUser();
                    if (currentUser) {
                        switch (currentUser.role) {
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
                                this.navigate('Login');
                        }
                    } else {
                        this.navigate('Login');
                    }
                }
            });
        }
    }

    getRoleColor(role) {
        switch (role) {
            case 'patient':
                return 'blue';
            case 'caretaker':
                return 'green';
            case 'doctor':
                return 'purple';
            default:
                return 'gray';
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
} 