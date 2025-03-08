// Alert component
class Alert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: props.message || '',
            type: props.type || 'info', // info, success, warning, error
            visible: true
        };
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.setState({ visible: false });
        }, 5000);
    }

    template() {
        if (!this.state.visible) return '';
        
        const bgColor = this.getBgColor();
        const textColor = this.getTextColor();
        const icon = this.getIcon();
        
        return `
            <div class="fixed top-4 right-4 bg-${bgColor}-100 border border-${bgColor}-400 text-${textColor}-700 px-4 py-3 rounded fade-in z-50 shadow-md">
                <div class="flex items-center">
                    <i class="fas ${icon} mr-2"></i>
                    <span>${this.state.message}</span>
                    <button id="close-alert" class="ml-4 text-${textColor}-700 hover:text-${textColor}-900">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }

    afterRender() {
        const closeBtn = document.getElementById('close-alert');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.setState({ visible: false });
            });
        }
    }

    getBgColor() {
        switch (this.state.type) {
            case 'success':
                return 'green';
            case 'warning':
                return 'yellow';
            case 'error':
                return 'red';
            default:
                return 'blue';
        }
    }

    getTextColor() {
        switch (this.state.type) {
            case 'success':
                return 'green';
            case 'warning':
                return 'yellow';
            case 'error':
                return 'red';
            default:
                return 'blue';
        }
    }

    getIcon() {
        switch (this.state.type) {
            case 'success':
                return 'fa-check-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'error':
                return 'fa-exclamation-circle';
            default:
                return 'fa-info-circle';
        }
    }
} 