class CopyLink {
    constructor() {
        this.copyLink();
    }

    copyLink() {
        const copyLinkBtn = document.querySelector('.copy-link-btn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                const copyText = copyLinkBtn.attributes['data-link'];
                navigator.clipboard.writeText(copyText.value).then(() => {
                    alert('Url copied in clipboard : ' + copyText.value);
                });
            });
        }
    }
}

// Init
document.querySelectorAll('.copy-link-btn').forEach((copyLinkBtn) => {
    new CopyLink(copyLinkBtn);
});