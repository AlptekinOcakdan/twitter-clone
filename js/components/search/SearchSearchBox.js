import { Component, router } from '@/core';

export class SearchSearchBox extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            placeholder: 'Ara',
            query: '',
            ...props
        };
    }

    render() {
        const { placeholder } = this.props;

        return `
            <div class="search-results-search sticky flex items-center justify-between">
                <div id="search-results-back">
                    <svg>
                        <use href="/assets/images/explore/arrow-left.svg#icon-arrow-left"/>
                    </svg>
                </div>
                <div class="search-results-search-container flex items-center">
                    <svg>
                        <use href="/assets/images/main/sidebar/search.svg#search"/>
                    </svg>
                    <label for="search-results-input" hidden></label>
                    <input type="text" placeholder="${placeholder}" id="search-results-input">
                </div>
                <div id="search-results-settings">
                    <svg>
                        <use href="/assets/images/header/dropdown/setting-privacy.svg#icon-setting-privacy"/>
                    </svg>
                </div>
            </div>
        `;
    }

    onMount() {
        const backBtn = this.element?.querySelector('#search-results-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.history.back();
            });
        }

        const input = this.element?.querySelector('#search-results-input');
        if (input) {
            input.value = this.props.query;

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    router.navigate(`/search?q=${encodeURIComponent(input.value.trim())}`);
                }
            });
        }
    }
}
