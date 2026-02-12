import { Component } from '@/core';

export class Dropdown extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: 'dropdown',
            triggerId: null,
            items: [],
            ...props
        };
        this.isOpen = false;
        this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
        this.boundHandleResize = this.handleResize.bind(this);
    }

    renderItems() {
        return this.props.items.map(item => `
            <button type="button" class="dropdown-item" data-dropdown-item="${item.id}">
                ${item.iconPath ? `<svg viewBox="0 0 24 24" class="dropdown-icon"><use href="${item.iconPath}"></use></svg>` : ''}
                <span>${item.label}</span>
            </button>
        `).join('');
    }

    render() {
        const { id } = this.props;

        return `
            <div class="dropdown" id="${id}">
                <div class="dropdown-content">
                    ${this.renderItems()}
                </div>
            </div>
        `;
    }

    getDropdown() {
        return document.getElementById(this.props.id);
    }

    getTrigger() {
        return document.querySelector(`[data-nav-id="${this.props.triggerId}"]`);
    }

    position() {
        const dropdown = this.getDropdown();
        const trigger = this.getTrigger();

        if (!dropdown || !trigger) return;

        const triggerRect = trigger.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        dropdown.style.visibility = 'hidden';
        dropdown.style.display = 'block';
        const dropdownRect = dropdown.getBoundingClientRect();
        dropdown.style.display = '';
        dropdown.style.visibility = '';

        let top = triggerRect.bottom + window.scrollY;
        let left = triggerRect.left + window.scrollX;

        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;

        if (spaceBelow < dropdownRect.height && spaceAbove > spaceBelow) {
            top = triggerRect.top + window.scrollY - dropdownRect.height;
        }

        if (left + dropdownRect.width > viewportWidth) {
            left = viewportWidth - dropdownRect.width - 10;
        }

        if (left < 0) {
            left = 10;
        }

        dropdown.style.top = `${top}px`;
        dropdown.style.left = `${left}px`;
    }

    open() {
        const dropdown = this.getDropdown();
        if (dropdown && !this.isOpen) {
            dropdown.classList.add('open');
            this.position();
            this.isOpen = true;
            setTimeout(() => {
                document.addEventListener('click', this.boundHandleOutsideClick);
                window.addEventListener('resize', this.boundHandleResize);
            }, 0);
        }
    }

    close() {
        const dropdown = this.getDropdown();
        if (dropdown && this.isOpen) {
            dropdown.classList.remove('open');
            this.isOpen = false;
            document.removeEventListener('click', this.boundHandleOutsideClick);
            window.removeEventListener('resize', this.boundHandleResize);
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    handleOutsideClick(e) {
        const dropdown = this.getDropdown();
        const trigger = this.getTrigger();

        if (dropdown && !dropdown.contains(e.target)) {
            if (!trigger || !trigger.contains(e.target)) {
                this.close();
            }
        }
    }

    handleResize() {
        if (this.isOpen) {
            this.position();
        }
    }

    onMount() {
        const trigger = this.getTrigger();

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            });
        }

        const dropdown = this.getDropdown();
        if (dropdown) {
            dropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const itemId = e.currentTarget.dataset.dropdownItem;
                    this.onItemClick(itemId);
                    this.close();
                });
            });
        }
    }

    onItemClick(itemId) {
        console.log('Dropdown item clicked:', itemId);
    }
}




