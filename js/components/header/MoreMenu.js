import { Dropdown } from '@/components/common';

export class MoreMenu extends Dropdown {
    constructor(props = {}) {
        super({
            id: 'more-menu-dropdown',
            triggerId: 'more',
            items: [],
            ...props
        });
    }

    render() {
        const { id } = this.props;

        return `
            <div class="dropdown more-menu" id="${id}">
                <div class="dropdown-content">
                    ${this.renderItems()}
                </div>
            </div>
        `;
    }

    position() {
        const dropdown = this.getDropdown();
        const trigger = this.getTrigger();

        if (!dropdown || !trigger) return;

        const triggerRect = trigger.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        dropdown.style.visibility = 'hidden';
        dropdown.style.display = 'block';
        const dropdownRect = dropdown.getBoundingClientRect();
        dropdown.style.display = '';
        dropdown.style.visibility = '';

        let top = triggerRect.top + window.scrollY - dropdownRect.height + triggerRect.height;
        let left = triggerRect.left + window.scrollX;

        if (left + dropdownRect.width > viewportWidth) {
            left = viewportWidth - dropdownRect.width - 10;
        }

        if (left < 0) {
            left = 10;
        }

        if (top < 0) {
            top = triggerRect.bottom + window.scrollY;
        }

        dropdown.style.top = `${top}px`;
        dropdown.style.left = `${left}px`;
    }

    onItemClick(itemId) {
        console.log('More menu item clicked:', itemId);
    }
}