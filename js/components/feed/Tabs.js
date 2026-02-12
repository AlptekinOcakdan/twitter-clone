import { Component } from '@/core';
import { Tab } from './Tab.js';

export class Tabs extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            tabs: [],
            ...props
        };
    }

    render() {
        const { tabs } = this.props;

        const tabsHtml = tabs.map(tab => {
            const tabComponent = new Tab(tab);
            return tabComponent.render();
        }).join('');

        return `
            <div id="tabs" class="flex">
                ${tabsHtml}
            </div>
        `;
    }
}

