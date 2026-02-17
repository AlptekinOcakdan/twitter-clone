import { Component } from '@/core';

export class ExploreSearchBox extends Component {
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
            <div class="explore-search sticky">
                <div class="explore-search-container flex items-center">
                    <svg>
                        <use href="assets/images/main/sidebar/search.svg#search"/>
                    </svg>
                    <label for="explore-search-input" hidden></label>
                    <input type="text" placeholder="${placeholder}" id="explore-search-input">
                </div>
            </div>
        `;
    }
}
