import { Component } from '@/core';

export class ProfileInfo extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            displayName: '',
            handle: '',
            isVerified: false,
            bio: '',
            joinDate: '',
            location: '',
            website: '',
            following: 0,
            followers: 0,
            ...props
        };
    }

    renderVerifiedIcon() {
        if (!this.props.isVerified) return '';

        return `
            <svg class="verified-icon" viewBox="0 0 24 24">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.01s-2.62-1.27-4.01-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.98-.2-4.02.81s-1.27 2.62-.81 4.01c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 4.01s2.62 1.27 4.01.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.98.2 4.02-.81s1.27-2.62.81-4.01c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.35-6.2 6.78z"></path>
            </svg>
        `;
    }

    renderBio() {
        if (!this.props.bio) return '';
        return `<p class="profile-info__bio">${this.props.bio}</p>`;
    }

    renderLocation() {
        if (!this.props.location) return '';
        return `
            <span class="profile-info__meta-item">
                <svg viewBox="0 0 24 24"><path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path></svg>
                ${this.props.location}
            </span>
        `;
    }

    renderWebsite() {
        if (!this.props.website) return '';
        return `
            <span class="profile-info__meta-item profile-info__meta-link">
                <svg viewBox="0 0 24 24"><path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02 5.18l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path></svg>
                <a href="${this.props.website}" target="_blank">${this.props.website}</a>
            </span>
        `;
    }

    renderJoinDate() {
        if (!this.props.joinDate) return '';
        return `
            <span class="profile-info__meta-item">
                <svg viewBox="0 0 24 24"><path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"></path></svg>
                Katılma tarihi: ${this.props.joinDate}
            </span>
        `;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace('.0', '') + ' M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + ' B';
        }
        return num.toString();
    }

    render() {
        const { displayName, handle, following, followers } = this.props;

        return `
            <div class="profile-info">
                <div class="profile-info__actions">
                    <button class="profile-info__edit-btn">Profili düzenle</button>
                </div>
                <div class="profile-info__name-row">
                    <span class="profile-info__display-name">${displayName}</span>
                    ${this.renderVerifiedIcon()}
                </div>
                <span class="profile-info__handle">${handle}</span>
                ${this.renderBio()}
                <div class="profile-info__meta">
                    ${this.renderLocation()}
                    ${this.renderWebsite()}
                    ${this.renderJoinDate()}
                </div>
                <div class="profile-info__stats">
                    <a href="#" class="profile-info__stat">
                        <span class="profile-info__stat-value">${this.formatNumber(following)}</span>
                        <span class="profile-info__stat-label">Takip Edilen</span>
                    </a>
                    <a href="#" class="profile-info__stat">
                        <span class="profile-info__stat-value">${this.formatNumber(followers)}</span>
                        <span class="profile-info__stat-label">Takipçi</span>
                    </a>
                </div>
            </div>
        `;
    }
}
