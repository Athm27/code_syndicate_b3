class Header extends Component {
    constructor(props) {
        super(props);
    }

    template() {
        return `
            <header class="main-header">
                <div class="header-container">
                    <a href="/" class="logo">
                        <h1>MediVarta</h1>
                    </a>
                    
                    <nav class="main-nav">
                        <a href="/find-doctors" class="nav-link">Find Doctors</a>
                        <a href="/video-consult" class="nav-link">Video Consult</a>
                        <a href="/medicine-stock" class="nav-link">Medicine Stock</a>
                        <a href="/reminders" class="nav-link">Reminders</a>
                    </nav>

                    <div class="header-actions">
                        ${Store.isLoggedIn() ? `
                            <button id="user-menu-btn" class="btn btn-secondary">
                                <span class="user-name">${Store.getCurrentUser().name}</span>
                            </button>
                            <button id="logout-btn" class="btn btn-danger">Logout</button>
                        ` : `
                            <button id="login-btn" class="btn btn-primary">Login</button>
                        `}
                    </div>
                </div>
            </header>
        `;
    }

    afterRender() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userMenuBtn = document.getElementById('user-menu-btn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.navigate('Login');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                this.navigate('Login');
            });
        }

        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', () => {
                this.navigate('UserProfile');
            });
        }
    }
} 