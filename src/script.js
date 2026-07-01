import { MEDIA } from './media.js';
import { thighs } from './ascii.js';

const g = document.getElementById('g');
const m = document.getElementById('m');
const nr = document.getElementById('nr');
const gt = document.getElementById('gt');
const art = document.getElementById('gate-art');

const CAP = 60; // dont let the dom grow forever

const vis = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        v.play().catch(() => {});
    } else {
        v.pause();
    }
}), { rootMargin: '200px 0px' });

function mk({ type, src }) {
    if (type === 'video') {
        const v = document.createElement('video');
        v.dataset.src = src;
        v.loop = true;
        v.muted = true;
        v.playsInline = true;
        v.preload = 'none'; 
        vis.observe(v);
        return v;
    }
    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy';
    img.decoding = 'async';
    return img;
}

function fill() {
    MEDIA.forEach(x => g.appendChild(mk(x)));
}
function prune() {
    while (g.children.length > CAP) {
        const dead = g.firstElementChild;
        if (dead === sentinel || dead.getBoundingClientRect().bottom > -1500) break;
        if (dead.tagName === 'VIDEO') { vis.unobserve(dead); dead.src = ''; }
        dead.remove();
    }
}

function more() {
    MEDIA.forEach(x => g.appendChild(mk(x)));
    g.appendChild(sentinel); 
    prune();
}

const sentinel = document.createElement('div');
sentinel.style.cssText = 'height:1px;grid-column:1/-1';
const loadMore = new IntersectionObserver(([e]) => e.isIntersecting && more(), {
    root: g,
    rootMargin: '1000px 0px'
});

m.onclick = () => {
    m.classList.toggle('open');
    nr.classList.toggle('show');
};

gt.onclick = () => {
    g.style.display = 'grid';
    gt.classList.add('h');
    g.appendChild(sentinel);
    loadMore.observe(sentinel);
};

document.oncontextmenu = e => e.preventDefault();
document.ondragstart = e => e.preventDefault();
document.onkeydown = e => {
    const nope = e.key === 'F12'
        || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase()))
        || (e.ctrlKey && e.key.toLowerCase() === 'u');
    if (nope) e.preventDefault();
};

art.textContent = thighs;
fill();
