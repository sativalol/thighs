import { MEDIA } from './media.js';
import { thighs } from './ascii.js';

const g = document.getElementById('g');
const m = document.getElementById('m');
const nr = document.getElementById('nr');
const gt = document.getElementById('gt');
const art = document.getElementById('gate-art');

const CAP = 60; 

const vis = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        if (v.tagName === 'VIDEO') v.play().catch(() => {});
    } else {
        if (v.tagName === 'VIDEO') v.pause();
    }
}), { rootMargin: '200px 0px' });

function mk({ type, src }) {
    if (type === 'video') {
        const v = document.createElement('video');
        v.dataset.src = src;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.controls = false;
        v.preload = 'none';
        vis.observe(v);
        return v;
    }
    const img = document.createElement('img');
    img.dataset.src = src;
    img.loading = 'lazy';
    img.decoding = 'async';
    vis.observe(img);
    return img;
}

function fill() {
    MEDIA.forEach(x => g.appendChild(mk(x)));
}

function prune() {
    while (g.children.length > CAP) {
        const dead = g.firstElementChild;
        if (dead === sen || dead.getBoundingClientRect().bottom > -1500) break;
        if (dead.tagName === 'VIDEO') { vis.unobserve(dead); dead.src = ''; }
        dead.remove();
    }
}

function more() {
    MEDIA.forEach(x => g.appendChild(mk(x)));
    g.appendChild(sen); 
    prune();
}

const sen = document.createElement('div');
sen.style.cssText = 'height:1px;grid-column:1/-1';
const lMore = new IntersectionObserver(([e]) => e.isIntersecting && more(), {
    root: g,
    rootMargin: '1000px 0px'
});

m.onclick = () => {
    m.classList.toggle('open');
    nr.classList.toggle('show');
};

const bg = MEDIA[Math.floor(Math.random() * MEDIA.length)];
const gtBg = document.createElement('div');
gtBg.className = 'gt-bg';
if (bg.type === 'video') {
    const v = document.createElement('video');
    v.src = bg.src;
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    gtBg.appendChild(v);
} else {
    const img = document.createElement('img');
    img.src = bg.src;
    gtBg.appendChild(img);
}
gt.insertBefore(gtBg, gt.firstChild);

gt.onclick = () => {
    g.style.display = 'grid';
    gt.classList.add('h');
    g.appendChild(sen);
    lMore.observe(sen);
    g.querySelectorAll('video').forEach(v => {
        if (v.src) v.play().catch(() => {});
    });
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

const btn = document.createElement('a');
btn.href = '#';
btn.className = 'lk col-toggle';
btn.textContent = 'columns';
btn.style.cursor = 'pointer';

let cols = 3;
btn.onclick = (e) => {
    e.preventDefault();
    cols = cols === 3 ? 2 : (cols === 2 ? 1 : 3);
    g.className = `g cols-${cols}`;
};
document.querySelector('.nl').appendChild(btn);


