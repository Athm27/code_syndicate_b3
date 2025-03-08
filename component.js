// Simple component system to mimic React-like components
class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
    }

    // Set state and trigger re-render
    setState(newState) {
        // Save the currently focused element
        const activeElement = document.activeElement;
        const activeElementId = activeElement ? activeElement.id : null;
        const selectionStart = activeElement && 'selectionStart' in activeElement ? activeElement.selectionStart : null;
        const selectionEnd = activeElement && 'selectionEnd' in activeElement ? activeElement.selectionEnd : null;
        
        // Update state
        this.state = { ...this.state, ...newState };
        
        // Re-render
        this.render();
        
        // Restore focus and selection if possible
        if (activeElementId) {
            const newActiveElement = document.getElementById(activeElementId);
            if (newActiveElement) {
                newActiveElement.focus();
                
                // Restore cursor position for inputs
                if (selectionStart !== null && 'setSelectionRange' in newActiveElement) {
                    newActiveElement.setSelectionRange(selectionStart, selectionEnd);
                }
            }
        }
    }

    // Mount component to DOM
    mount(selector) {
        this.container = document.querySelector(selector);
        this.render();
        return this;
    }

    // Render component (to be overridden by child classes)
    render() {
        if (!this.container) return;
        this.container.innerHTML = this.template();
        this.afterRender();
    }

    // Template method (to be overridden by child classes)
    template() {
        return '';
    }

    // After render hook for event listeners (to be overridden by child classes)
    afterRender() {}

    // Navigate to a different view
    navigate(component, props = {}) {
        App.navigate(component, props);
    }
    
    // Go back to previous page
    goBack() {
        return App.goBack();
    }
} 