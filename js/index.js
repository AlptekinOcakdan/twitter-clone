const main = document.querySelector('main');
const feed = document.getElementById('feed');
const sidebar = document.getElementById('sidebar');

main.addEventListener('wheel', (e) => {
    e.preventDefault();
    feed.scrollTop += e.deltaY;
    sidebar.scrollTop += e.deltaY;
}, { passive: false });


