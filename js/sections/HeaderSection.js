import { Section, dataService } from '@/core';
import { Logo, Navigation, PublishButton, UserProfile, MoreMenu } from '@/components/header';
import { Dialog } from '@/components/common';
import { DialogPostCreate } from '@/components/post';

export class HeaderSection extends Section {
    constructor(props = {}) {
        super(props);
        this.headerData = null;
        this.userData = null;
        this.moreMenuData = null;
        this.moreMenu = null;
        this.userProfile = null;
        this.postDialog = null;
    }

    async loadData() {
        const [headerData, userData, moreMenuData] = await Promise.all([
            dataService.load('header'),
            dataService.load('user'),
            dataService.load('more-menu')
        ]);
        this.headerData = headerData;
        this.userData = userData;
        this.moreMenuData = moreMenuData;
    }

    render() {
        if (!this.headerData || !this.userData) {
            return '<header><div id="header-container">Yükleniyor...</div></header>';
        }

        const currentPath = window.location.pathname;
        const logo = new Logo(this.headerData.logo);
        const navigation = new Navigation({
            items: this.headerData.navigation,
            currentPath: currentPath
        });
        const publishButton = new PublishButton(this.headerData.publishButton);
        this.userProfile = new UserProfile({
            displayName: this.userData.displayName,
            handle: this.userData.handle,
            avatar: this.userData.avatar
        });

        this.moreMenu = new MoreMenu({
            items: this.moreMenuData?.items || []
        });

        return `
            <header>
                <div id="header-container" class="flex flex-col items-start">
                    ${logo.render()}
                    ${navigation.render()}
                    ${this.moreMenu.render()}
                    ${publishButton.render()}
                    ${this.userProfile.render()}
                </div>
            </header>
        `;
    }

    onMount() {
        super.onMount();
        if (this.moreMenu) {
            this.moreMenu.onMount();
        }

        if (this.userProfile) {
            const userProfileEl = this.element.querySelector('#user-profile');
            if (userProfileEl) {
                this.userProfile.element = userProfileEl;
                this.userProfile.onMount();
            }
        }

        const publishButton = this.element.querySelector('#publish');
        if (publishButton) {
            publishButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPostDialog();
            });
        }
    }

    openPostDialog() {
        const dialogPostCreate = new DialogPostCreate({
            onPostCreated: () => {
                this.postDialog.close();
            }
        });
        this.postDialog = new Dialog({
            title: '',
            cssClass: 'dialog-post-modal',
            headerExtra: '<button class="dialog-drafts-btn">Taslaklar</button>',
            contentComponent: dialogPostCreate
        });
        this.postDialog.open();
    }
}
