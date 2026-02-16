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
        const userProfile = new UserProfile({
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
                    ${userProfile.render()}
                </div>
            </header>
        `;
    }

    onMount() {
        super.onMount();
        if (this.moreMenu) {
            this.moreMenu.onMount();
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
        if (!this.postDialog) {
            const dialogPostCreate = new DialogPostCreate();
            this.postDialog = new Dialog({
                title: '',
                contentComponent: dialogPostCreate
            });
        }
        this.postDialog.open();
    }
}
