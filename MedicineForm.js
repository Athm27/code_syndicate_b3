// MedicineForm component
class MedicineForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            dosage: '',
            stock: '',
            lowStockThreshold: '',
            error: '',
            currentUser: null,
            medicine: null,
            isEditing: false
        };
    }

    template() {
        const { currentUser, medicine, isEditing } = this.state;
        
        // Create navbar but only use its template
        const navbarTemplate = new Navbar({ showBackButton: true }).template();
        
        return `
            ${navbarTemplate}
            <div class="container mx-auto p-4 page-transition">
                <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-semibold mb-6">Add New Medicine</h2>
                    
                    ${this.state.error ? `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">${this.state.error}</div>` : ''}
                    
                    <form id="medicine-form" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                                Medicine Name
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="name" 
                                type="text" 
                                placeholder="Medicine Name"
                                value="${this.state.name}"
                                required
                            >
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="dosage">
                                Dosage
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="dosage" 
                                type="text" 
                                placeholder="e.g. 500mg"
                                value="${this.state.dosage}"
                                required
                            >
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="stock">
                                Current Stock
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="stock" 
                                type="number" 
                                placeholder="Number of units"
                                value="${this.state.stock}"
                                min="0"
                                required
                            >
                        </div>
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="low-stock-threshold">
                                Low Stock Alert Threshold
                            </label>
                            <input 
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="low-stock-threshold" 
                                type="number" 
                                placeholder="Alert when stock is below this number"
                                value="${this.state.lowStockThreshold}"
                                min="1"
                                required
                            >
                            <p class="text-xs text-gray-500 mt-1">You will receive an alert when your stock falls below this number.</p>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <button 
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                                type="submit"
                            >
                                Add Medicine
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

        // Form submission
        document.getElementById('medicine-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddMedicine();
        });
        
        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.navigate('PatientDashboard');
        });
        
        // Add input event listeners
        document.getElementById('name').addEventListener('input', (e) => {
            this.setState({ name: e.target.value });
        });
        
        document.getElementById('dosage').addEventListener('input', (e) => {
            this.setState({ dosage: e.target.value });
        });
        
        document.getElementById('stock').addEventListener('input', (e) => {
            this.setState({ stock: e.target.value });
        });
        
        document.getElementById('low-stock-threshold').addEventListener('input', (e) => {
            this.setState({ lowStockThreshold: e.target.value });
        });
    }

    handleAddMedicine() {
        const { name, dosage, stock, lowStockThreshold } = this.state;
        
        // Validate inputs
        if (!name || !dosage || !stock || !lowStockThreshold) {
            this.setState({ error: 'Please fill in all fields' });
            return;
        }
        
        if (parseInt(stock) < 0) {
            this.setState({ error: 'Stock cannot be negative' });
            return;
        }
        
        if (parseInt(lowStockThreshold) < 1) {
            this.setState({ error: 'Low stock threshold must be at least 1' });
            return;
        }
        
        // Add medicine
        const newMedicine = Store.addMedicine(name, dosage, stock, lowStockThreshold);
        
        if (newMedicine) {
            // Show success alert and navigate back to dashboard
            this.navigate('PatientDashboard');
            
            // Show success alert
            new Alert({
                message: `${name} added successfully`,
                type: 'success'
            }).mount('body');
        } else {
            this.setState({ error: 'Failed to add medicine' });
        }
    }
} 