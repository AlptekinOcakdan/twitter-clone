import { Component } from '@/core';

export class SearchBox extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            placeholder: 'Ara',
            ...props
        };
    }

    render() {
        const { placeholder } = this.props;

        return `
            <div class="sidebar-search sticky">
                <div class="search-container flex items-center">
                    <svg>
                        <use href="assets/images/main/sidebar/search.svg#search"/>
                    </svg>
                    <label for="search-input" hidden></label>
                    <input type="text" placeholder="${placeholder}" id="search-input">
                </div>
            </div>
        `;
    }
}

