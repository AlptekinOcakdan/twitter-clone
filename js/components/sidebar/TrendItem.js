import { Component } from '@/core';

export class TrendItem extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: '',
            category: '',
            name: '',
            ...props
        };
    }

    render() {
        const { id, category, name } = this.props;

        return `
            <div class="trend-item flex justify-between" data-trend-id="${id}">
                <div class="trend-info">
                    <span class="trend-meta">${category}</span>
                    <span class="trend-name">${name}</span>
                </div>
                <button class="trend-more">
                    <svg viewBox="0 0 24 24"><use href="assets/images/main/sidebar/more.svg#more"/></svg>
                </button>
            </div>
        `;
    }
}

