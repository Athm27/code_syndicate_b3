// MedicineList component (also handles linking patients and caretakers)
class MedicineList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: Store.getCurrentUser(),
            users: [],
            selectedUserId: '',
            error: '',
            success: ''
        };
        
        // Load users
        this.loadUsers();
    }

    loadUsers() {
        const currentUser = Store.getCurrentUser();
        
        if (!currentUser) {
            this.navigate('Login');
            return;
        }
        
        const data = Store.getData();
        let users = [];
        
        // If current user is a patient, show caretakers
        if (currentUser.role === 'patient') {
            users = data.users.filter(u => u.role === 'caretaker');
        }
        // If current user is a caretaker, show patients
        else if (currentUser.role === 'caretaker') {
            users = data.users.filter(u => u.role === 'patient');
        }
        
        // Filter out already linked users
        if (currentUser.role === 'patient' && currentUser.caretakers) {
            users = users.filter(u => !currentUser.caretakers.includes(u.id));
        } else if (currentUser.role === 'caretaker' && currentUser.patients) {
            users = users.filter(u => !currentUser.patients.includes(u.id));
        }
        
        this.setState({
            currentUser,
            users,
            selectedUserId: users.length > 0 ? users[0].id : ''
        });
    }

    template() {
        const { currentUser, users, selectedUserId, error, success } = this.state;
        
        // Create navbar but only use its template
        const navbarTemplate = new Navbar({ showBackButton: true }).template();
        
        // Determine the role we're looking for
        const targetRole = currentUser.role === 'patient' ? 'caretaker' : 'patient';
        const roleCapitalized = targetRole.charAt(0).toUpperCase() + targetRole.slice(1);
        
        // Get linked users
        const data = Store.getData();
        const linkedUserIds = currentUser.role === 'patient' 
            ? (currentUser.caretakers || [])
            : (currentUser.patients || []);
        
        const linkedUsers = data.users.filter(u => linkedUserIds.includes(u.id));
        
        return `
            ${navbarTemplate}
            <div class="container mx-auto p-4 page-transition">
                <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-semibold mb-6">Link with ${roleCapitalized}</h2>
                    
                    ${error ? `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">${error}</div>` : ''}
                    ${success ? `<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">${success}</div>` : ''}
                    
                    <!-- Current Links -->
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold mb-2">Current ${roleCapitalized}s</h3>
                        
                        ${linkedUsers.length > 0 ? `
                            <div class="space-y-2">
                                ${linkedUsers.map(user => `
                                    <div class="flex items-center justify-between bg-gray-50 p-3 rounded">
                                        <span>${user.username}</span>
                                        <span class="text-sm text-gray-500">${roleCapitalized}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="text-center py-4 text-gray-500">
                                <p>No ${targetRole}s linked yet.</p>
                            </div>
                        `}
                    </div>
                    
                    <!-- Link Form -->
                    ${users.length > 0 ? `
                        <form id="link-form" class="space-y-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="user">
                                    Select ${roleCapitalized} to Link
                                </label>
                                <select 
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                    id="user"
                                    required
                                >
                                    ${users.map(user => `
                                        <option value="${user.id}" ${user.id === selectedUserId ? 'selected' : ''}>
                                            ${user.username}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="flex items-center justify-between pt-4">
                                <button 
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="submit"
                                >
                                    Link ${roleCapitalized}
                                </button>
                                <button 
                                    id="cancel-btn"
                                    class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ` : `
                        <div class="text-center py-4 text-gray-500">
                            <p>No ${targetRole}s available to link.</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    afterRender() {
        // Set up the navbar event listeners
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
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                this.navigate('Login');
            });
        }
        
        // Add event listeners for form
        const linkForm = document.getElementById('link-form');
        if (linkForm) {
            linkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLink();
            });
            
            document.getElementById('cancel-btn').addEventListener('click', () => {
                this.navigateToDashboard();
            });
            
            // Add input event listeners
            document.getElementById('user').addEventListener('change', (e) => {
                this.setState({ selectedUserId: parseInt(e.target.value) });
            });
        }
    }

    handleLink() {
        const { currentUser, selectedUserId } = this.state;
        
        if (!selectedUserId) {
            this.setState({ error: 'Please select a user to link with' });
            return;
        }
        
        let success = false;
        
        // Link patient with caretaker
        if (currentUser.role === 'patient') {
            success = Store.linkCaretaker(currentUser.id, selectedUserId);
        } 
        // Link caretaker with patient
        else if (currentUser.role === 'caretaker') {
            success = Store.linkCaretaker(selectedUserId, currentUser.id);
        }
        
        if (success) {
            // Reload data to get updated links
            const updatedUser = Store.getCurrentUser();
            
            // Update the current user in the state
            this.setState({ 
                currentUser: updatedUser,
                success: 'Link created successfully', 
                error: '' 
            });
            
            // Reload users to update the dropdown
            this.loadUsers();
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                this.setState({ success: '' });
            }, 3000);
        } else {
            this.setState({ 
                error: 'Failed to create link', 
                success: '' 
            });
        }
    }

    navigateToDashboard() {
        const { currentUser } = this.state;
        
        if (currentUser.role === 'patient') {
            this.navigate('PatientDashboard');
        } else if (currentUser.role === 'caretaker') {
            this.navigate('CaretakerDashboard');
        } else {
            this.navigate('Login');
        }
    }
} 