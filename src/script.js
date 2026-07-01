import { MEDIA } from './media.js';
import { thighs } from './ascii.js';

const g = document.getElementById('g');
const m = document.getElementById('m');
const nr = document.getElementById('nr');
const gt = document.getElementById('gt');
const art = document.getElementById('gate-art');

let busy = false;

function mk({ type, src }) {
    const el = document.createElement(type === 'video' ? 'video' : 'img');
    el.src = src;
    if (type === 'video') Object.assign(el, { loop: true, muted: true, autoplay: true, playsInline: true });
    return el;
}

function fill() {
    MEDIA.forEach(x => g.appendChild(mk(x)));
}

function more() {
    [...g.children].slice(0, MEDIA.length).forEach(n => {
        const c = n.cloneNode(true);
        if (c.tagName === 'VIDEO') c.play().catch(() => {});
        g.appendChild(c);
    });
}

m.onclick = () => {
    m.classList.toggle('open');
    nr.classList.toggle('show');
};

gt.onclick = () => {
    g.style.display = 'grid';
    gt.classList.add('h');
    g.addEventListener('scroll', () => {
        if (busy) return;
        busy = true;
        requestAnimationFrame(() => {
            if (g.scrollTop + g.clientHeight >= g.scrollHeight - 1000) more();
            busy = false;
        });
    }, { passive: true });
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
