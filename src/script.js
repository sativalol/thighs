import { MEDIA } from './media.js';
import { GATE_ASCII } from './ascii-art.js';

const grid = document.getElementById('g');
const menuBtn = document.getElementById('m');
const navRight = document.getElementById('nr');
const gate = document.getElementById('gt');
const gateArt = document.getElementById('gate-art');

let isTicking = false;

function createMediaElement({ type, src }) {
    if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        return video;
    }
    const img = document.createElement('img');
    img.src = src;
    return img;
}

function renderInitialGrid() {
    const fragment = document.createDocumentFragment();
    MEDIA.forEach(item => fragment.appendChild(createMediaElement(item)));
    grid.appendChild(fragment);
}

function loadMore() {
    const fragment = document.createDocumentFragment();
    Array.from(grid.children).slice(0, MEDIA.length).forEach(node => {
        const clone = node.cloneNode(true);
        if (clone.tagName === 'VIDEO') {
            clone.currentTime = 0;
            clone.play().catch(() => {});
        }
        fragment.appendChild(clone);
    });
    grid.appendChild(fragment);
}

function toggleMobileMenu() {
    menuBtn.classList.toggle('open');
    navRight.classList.toggle('show');
}

function onGridScroll() {
    if (isTicking) return;
    isTicking = true;
    window.requestAnimationFrame(() => {
        if (grid.scrollTop + grid.clientHeight >= grid.scrollHeight - 1000) {
            loadMore();
        }
        isTicking = false;
    });
}

function enterSite() {
    grid.style.display = 'grid';
    gate.classList.add('h');
    grid.addEventListener('scroll', onGridScroll, { passive: true });
}

function blockInspection() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        const blocked =
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && e.key.toLowerCase() === 'u');
        if (blocked) e.preventDefault();
    });
    document.addEventListener('dragstart', e => e.preventDefault());
}

function init() {
    gateArt.textContent = GATE_ASCII;
    renderInitialGrid();
    menuBtn.addEventListener('click', toggleMobileMenu);
    gate.addEventListener('click', enterSite);
    blockInspection();
}

init();
