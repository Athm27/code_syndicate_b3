class Footer extends Component {
    constructor(props) {
        super(props);
    }

    template() {
        return `
            <footer class="main-footer">
                <div class="footer-container">
                    <div class="footer-section">
                        <h3>MediVarta</h3>
                        <p>Your trusted healthcare companion</p>
                        <div class="app-downloads">
                            <a href="#" class="app-link">
                                <img src="/assets/google-play.png" alt="Get it on Google Play">
                            </a>
                            <a href="#" class="app-link">
                                <img src="/assets/app-store.png" alt="Download on App Store">
                            </a>
                        </div>
                    </div>

                    <div class="footer-section">
                        <h4>For patients</h4>
                        <ul>
                            <li><a href="/search-doctors">Search for doctors</a></li>
                            <li><a href="/video-consult">Video consultation</a></li>
                            <li><a href="/medicine-stock">Medicine stock</a></li>
                            <li><a href="/reminders">Medicine reminders</a></li>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h4>For doctors</h4>
                        <ul>
                            <li><a href="/doctor-profile">Profile</a></li>
                            <li><a href="/for-clinics">For clinics</a></li>
                            <li><a href="/ray-tab">Ray Tab</a></li>
                            <li><a href="/medivarta-pro">MediVarta Pro</a></li>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h4>More</h4>
                        <ul>
                            <li><a href="/about">About</a></li>
                            <li><a href="/blog">Blog</a></li>
                            <li><a href="/careers">Careers</a></li>
                            <li><a href="/press">Press</a></li>
                            <li><a href="/contact">Contact us</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <div class="footer-container">
                        <p>&copy; ${new Date().getFullYear()} MediVarta. All rights reserved.</p>
                        <div class="footer-links">
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/terms">Terms of Service</a>
                            <a href="/healthcare-directory">Healthcare Directory</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
} 