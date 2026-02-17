import { Component } from '@/core';

export class ExploreFollowItem extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            id: '',
            displayName: '',
            handle: '',
            avatar: '',
            isVerified: false,
            verifiedType: 'blue',
            ...props
        };
    }

    renderVerifiedIcon() {
        const { isVerified, verifiedType } = this.props;
        if (!isVerified) return '';

        const style = verifiedType === 'gray' ? ' style="fill: #536471;"' : '';

        return `
            <svg class="verified-icon"${style} viewBox="0 0 24 24">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.01s-2.62-1.27-4.01-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.98-.2-4.02.81s-1.27 2.62-.81 4.01c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 4.01s2.62 1.27 4.01.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.98.2 4.02-.81s1.27-2.62.81-4.01c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.35-6.2 6.78z"></path>
            </svg>
        `;
    }

    render() {
        const { id, displayName, handle, avatar } = this.props;

        return `
            <div class="explore-follow-item flex items-center justify-between" data-user-id="${id}">
                <div class="flex items-center explore-follow-item__main">
                    <img src="${avatar}" alt="${displayName}" class="explore-follow-avatar">
                    <div class="explore-follow-user-info">
                        <div class="flex items-center">
                            <span class="display-name">${displayName}</span>
                            ${this.renderVerifiedIcon()}
                        </div>
                        <span class="handle">${handle}</span>
                    </div>
                </div>
                <button class="explore-follow-btn">Takip et</button>
            </div>
        `;
    }
}
