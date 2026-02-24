import { Component, safeCreateFragment } from '@/core';

export class ScheduleModal extends Component {
    constructor(props = {}) {
        super(props);
        this.props = {
            onSchedule: null,
            ...props
        };
        this.dialogElement = null;
        this.close = this.close.bind(this);

        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);

        this.selectedDate = now.toISOString().split('T')[0];
        this.selectedHour = String(now.getHours()).padStart(2, '0');
        this.selectedMinute = '00';
    }

    open() {
        const html = this.renderDialog();
        const fragment = safeCreateFragment(html);
        this.dialogElement = fragment.firstElementChild;
        document.body.appendChild(this.dialogElement);
        document.body.style.overflow = 'hidden';
        this.attachEventListeners();
    }

    close() {
        if (this.dialogElement) {
            this.dialogElement.remove();
            this.dialogElement = null;
        }
        document.body.style.overflow = '';
    }

    renderDialog() {
        const hours = [];
        for (let i = 0; i < 24; i++) {
            hours.push(String(i).padStart(2, '0'));
        }

        const minutes = [];
        for (let i = 0; i < 60; i += 5) {
            minutes.push(String(i).padStart(2, '0'));
        }

        const today = new Date().toISOString().split('T')[0];

        return `
            <div class="dialog-overlay schedule-modal-overlay">
                <div class="dialog-container schedule-modal" role="dialog" aria-modal="true">
                    <div class="dialog-header">
                        <button class="dialog-close schedule-close" aria-label="Kapat">
                            <svg viewBox="0 0 24 24"><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></svg>
                        </button>
                        <h2 class="dialog-title">Planla</h2>
                    </div>
                    <div class="dialog-body schedule-body">
                        <div class="schedule-info">
                            <svg viewBox="0 0 24 24" class="schedule-info-icon">
                                <path d="M6 3V2h2v1h8V2h2v1h1.5C20.327 3 21 3.673 21 4.5v15c0 .827-.673 1.5-1.5 1.5h-15c-.827 0-1.5-.673-1.5-1.5v-15C3 3.673 3.673 3 4.5 3H6zm0 2H4.5c-.276 0-.5.224-.5.5v15c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-15c0-.276-.224-.5-.5-.5H18v1h-2V5H8v1H6V5zm1.5 5h3v3h-3v-3z"></path>
                            </svg>
                            <p class="schedule-info-text">Gönderinin yayınlanacağı tarihi ve saati seçin.</p>
                        </div>

                        <div class="schedule-form">
                            <div class="schedule-field">
                                <label class="schedule-label">Tarih</label>
                                <input type="date" class="schedule-date-input" value="${this.selectedDate}" min="${today}">
                            </div>
                            <div class="schedule-time-row flex">
                                <div class="schedule-field grow">
                                    <label class="schedule-label">Saat</label>
                                    <select class="schedule-hour-select">
                                        ${hours.map(h => `<option value="${h}" ${h === this.selectedHour ? 'selected' : ''}>${h}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="schedule-field grow">
                                    <label class="schedule-label">Dakika</label>
                                    <select class="schedule-minute-select">
                                        ${minutes.map(m => `<option value="${m}" ${m === this.selectedMinute ? 'selected' : ''}>${m}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="schedule-preview">
                            <span class="schedule-preview-label">Planlanacak tarih:</span>
                            <span class="schedule-preview-date">${this.formatPreviewDate()}</span>
                        </div>
                    </div>
                    <div class="schedule-footer">
                        <button class="schedule-confirm-btn">Onayla</button>
                    </div>
                </div>
            </div>
        `;
    }

    formatPreviewDate() {
        const date = new Date(`${this.selectedDate}T${this.selectedHour}:${this.selectedMinute}:00`);
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${this.selectedHour}:${this.selectedMinute}`;
    }

    updatePreview() {
        const previewDate = this.dialogElement?.querySelector('.schedule-preview-date');
        if (previewDate) {
            previewDate.textContent = this.formatPreviewDate();
        }
    }

    attachEventListeners() {
        if (!this.dialogElement) return;

        const closeBtn = this.dialogElement.querySelector('.schedule-close');
        closeBtn?.addEventListener('click', this.close);

        this.dialogElement.addEventListener('click', (e) => {
            if (e.target === this.dialogElement) {
                this.close();
            }
        });

        const dateInput = this.dialogElement.querySelector('.schedule-date-input');
        const hourSelect = this.dialogElement.querySelector('.schedule-hour-select');
        const minuteSelect = this.dialogElement.querySelector('.schedule-minute-select');

        dateInput?.addEventListener('change', (e) => {
            this.selectedDate = e.target.value;
            this.updatePreview();
        });

        hourSelect?.addEventListener('change', (e) => {
            this.selectedHour = e.target.value;
            this.updatePreview();
        });

        minuteSelect?.addEventListener('change', (e) => {
            this.selectedMinute = e.target.value;
            this.updatePreview();
        });

        const confirmBtn = this.dialogElement.querySelector('.schedule-confirm-btn');
        confirmBtn?.addEventListener('click', () => {
            const scheduledDate = new Date(`${this.selectedDate}T${this.selectedHour}:${this.selectedMinute}:00`);
            const now = new Date();

            if (scheduledDate <= now) {
                alert('Geçmiş bir tarih seçemezsiniz.');
                return;
            }

            if (this.props.onSchedule) {
                this.props.onSchedule(scheduledDate.toISOString());
            }
            this.close();
        });
    }
}
