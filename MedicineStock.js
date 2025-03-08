class MedicineStock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: Store.getCurrentUser(),
            medicines: Store.getUserMedicines(),
            message: '',
            messageType: 'info',
            showAddModal: false,
            notifications: [],
            sortBy: 'name',
            filterBy: 'all'
        };

        // Check for low stock and expiring medicines on load
        this.checkLowStock();
        this.checkExpiringMedicines();
    }

    template() {
        const { medicines, message, messageType, showAddModal, notifications, sortBy, filterBy } = this.state;

        // Sort medicines
        const sortedMedicines = [...medicines].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'expiry':
                    return new Date(a.expiryDate) - new Date(b.expiryDate);
                case 'quantity':
                    return a.quantity - b.quantity;
                default:
                    return 0;
            }
        });

        // Filter medicines
        const filteredMedicines = sortedMedicines.filter(medicine => {
            switch (filterBy) {
                case 'lowStock':
                    return medicine.quantity <= medicine.minQuantity;
                case 'expiringSoon':
                    const daysUntilExpiry = Math.ceil((new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 30;
                default:
                    return true;
            }
        });

        return `
            <div class="medicine-stock-page">
                <header class="page-header">
                    <h1>MediVarta - Medicine Stock</h1>
                    <div class="header-actions">
                        <button id="add-medicine-btn" class="btn btn-primary">Add Medicine</button>
                        <button id="reminders-btn" class="btn btn-secondary">Reminders</button>
                        <button id="back-btn" class="btn btn-secondary">Back</button>
                        <button id="logout-btn" class="btn btn-danger">Logout</button>
                    </div>
                </header>

                ${message ? `
                    <div class="alert alert-${messageType}">
                        ${message}
                        <button class="dismiss-btn">&times;</button>
                    </div>
                ` : ''}

                ${notifications.map(notification => `
                    <div class="notification ${notification.type}">
                        <span>${notification.message}</span>
                        <button class="dismiss-btn" data-id="${notification.id}">&times;</button>
                    </div>
                `).join('')}

                <div class="controls-row">
                    <div class="sort-filter">
                        <select id="sort-select" class="form-control">
                            <option value="name" ${sortBy === 'name' ? 'selected' : ''}>Sort by Name</option>
                            <option value="expiry" ${sortBy === 'expiry' ? 'selected' : ''}>Sort by Expiry Date</option>
                            <option value="quantity" ${sortBy === 'quantity' ? 'selected' : ''}>Sort by Quantity</option>
                        </select>
                        <select id="filter-select" class="form-control">
                            <option value="all" ${filterBy === 'all' ? 'selected' : ''}>All Medicines</option>
                            <option value="lowStock" ${filterBy === 'lowStock' ? 'selected' : ''}>Low Stock</option>
                            <option value="expiringSoon" ${filterBy === 'expiringSoon' ? 'selected' : ''}>Expiring Soon</option>
                        </select>
                    </div>
                </div>

                <div class="medicines-grid">
                    ${filteredMedicines.length > 0 ? filteredMedicines.map(medicine => {
                        const daysUntilExpiry = Math.ceil((new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                        const isExpiringSoon = daysUntilExpiry <= 30;
                        const isLowStock = medicine.quantity <= medicine.minQuantity;
                        
                        return `
                            <div class="medicine-card ${isExpiringSoon ? 'expiring-soon' : ''} ${isLowStock ? 'low-stock' : ''}">
                                <div class="medicine-info">
                                    <h3>${medicine.name}</h3>
                                    <div class="medicine-details">
                                        <span>Quantity: ${medicine.quantity} ${medicine.unit}</span>
                                        <span>Expiry: ${new Date(medicine.expiryDate).toLocaleDateString()}</span>
                                        <span>Dosage: ${medicine.dosage}</span>
                                    </div>
                                    ${isLowStock ? `
                                        <div class="warning-badge low-stock-warning">
                                            Low Stock Warning!
                                        </div>
                                    ` : ''}
                                    ${isExpiringSoon ? `
                                        <div class="warning-badge expiry-warning">
                                            Expires in ${daysUntilExpiry} days
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="medicine-actions">
                                    <button class="btn btn-primary edit-medicine" data-id="${medicine.id}">Edit</button>
                                    <button class="btn btn-danger delete-medicine" data-id="${medicine.id}">Delete</button>
                                </div>
                            </div>
                        `;
                    }).join('') : `
                        <div class="empty-state">
                            <p>No medicines in stock</p>
                            <button id="add-first-medicine-btn" class="btn btn-primary">Add Your First Medicine</button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    afterRender() {
        // ... existing event listeners ...

        // Reminders button
        const remindersBtn = document.getElementById('reminders-btn');
        if (remindersBtn) {
            remindersBtn.addEventListener('click', () => {
                this.navigate('Reminders');
            });
        }

        // Notification dismiss buttons
        document.querySelectorAll('.notification .dismiss-btn').forEach(button => {
            button.addEventListener('click', () => {
                const notificationId = button.getAttribute('data-id');
                this.dismissNotification(notificationId);
            });
        });

        // Sort and filter handlers
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setState({ sortBy: e.target.value });
            });
        }

        const filterSelect = document.getElementById('filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.setState({ filterBy: e.target.value });
            });
        }
    }

    checkLowStock() {
        const lowStockMedicines = this.state.medicines.filter(medicine => 
            medicine.quantity <= medicine.minQuantity
        );

        lowStockMedicines.forEach(medicine => {
            this.showNotification({
                id: Date.now() + medicine.id,
                message: `Low stock alert: ${medicine.name} (${medicine.quantity} ${medicine.unit} remaining)`,
                type: 'warning'
            });
        });
    }

    checkExpiringMedicines() {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

        const expiringMedicines = this.state.medicines.filter(medicine => {
            const expiryDate = new Date(medicine.expiryDate);
            return expiryDate <= thirtyDaysFromNow && expiryDate > today;
        });

        expiringMedicines.forEach(medicine => {
            const daysUntilExpiry = Math.ceil((new Date(medicine.expiryDate) - today) / (1000 * 60 * 60 * 24));
            this.showNotification({
                id: Date.now() + medicine.id + '_expiry',
                message: `${medicine.name} will expire in ${daysUntilExpiry} days`,
                type: 'warning'
            });
        });
    }

    showNotification(notification) {
        const notifications = [...this.state.notifications, notification];
        this.setState({ notifications });

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            this.dismissNotification(notification.id);
        }, 10000);
    }

    dismissNotification(id) {
        const notifications = this.state.notifications.filter(n => n.id !== id);
        this.setState({ notifications });
    }

    saveMedicine() {
        const name = document.getElementById('medicine-name').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const unit = document.getElementById('unit').value;
        const dosage = document.getElementById('dosage').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const minQuantity = parseInt(document.getElementById('min-quantity').value);

        const medicine = {
            name,
            quantity,
            unit,
            dosage,
            expiryDate,
            minQuantity
        };

        const result = Store.saveMedicine(medicine);

        if (result.success) {
            const medicines = Store.getUserMedicines();
            this.setState({
                message: 'Medicine saved successfully.',
                messageType: 'success',
                showAddModal: false,
                medicines
            });
            this.checkLowStock();
        } else {
            this.setState({
                message: result.message || 'Failed to save medicine.',
                messageType: 'error'
            });
        }
    }

    // ... existing methods ...
}