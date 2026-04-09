const priorityMeta = {
    1: {
        label: 'Must go',
        labelZh: '必去',
        className: 'priority-pill--1',
        markerClass: 'marker-pin--1'
    },
    2: {
        label: 'Will go',
        labelZh: '會去',
        className: 'priority-pill--2',
        markerClass: 'marker-pin--2'
    },
    3: {
        label: 'Maybe go',
        labelZh: '可考慮',
        className: 'priority-pill--3',
        markerClass: 'marker-pin--3'
    }
};

const map = L.map('map', {
    zoomControl: true,
    preferCanvas: true
}).setView([22.172, 113.553], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
}).addTo(map);

const listContainer = document.getElementById('location-list');
const selectedLocation = document.getElementById('selected-location');
const locationCount = document.getElementById('location-count');
const sidebar = document.getElementById('sidebar');
const sidebarGrabber = document.getElementById('sidebar-grabber');
const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
const mobileSidebarBackdrop = document.getElementById('mobile-sidebar-backdrop');
const markers = new Map();
const cards = new Map();
const mobileMedia = window.matchMedia('(max-width: 980px)');
const sheetPeekHeight = 78;
let dragState = null;

function isMobileLayout() {
    return mobileMedia.matches;
}

function setSidebarCollapsed(collapsed) {
    if (!isMobileLayout()) {
        document.body.classList.remove('sidebar-collapsed');
        document.body.classList.remove('sidebar-dragging');
        sidebar?.style.removeProperty('transform');
        mobileSidebarToggle?.setAttribute('aria-expanded', 'true');
        return;
    }

    document.body.classList.toggle('sidebar-collapsed', collapsed);
    document.body.classList.remove('sidebar-dragging');
    sidebar?.style.removeProperty('transform');
    mobileSidebarToggle?.setAttribute('aria-expanded', String(!collapsed));
}

function syncSidebarMode() {
    setSidebarCollapsed(isMobileLayout());
}

function getCollapsedOffset() {
    if (!sidebar) {
        return 0;
    }

    return Math.max(0, sidebar.offsetHeight - sheetPeekHeight);
}

function startSidebarDrag(clientY) {
    if (!isMobileLayout() || !sidebar || dragState) {
        return;
    }

    const isCollapsed = document.body.classList.contains('sidebar-collapsed');
    const maxOffset = getCollapsedOffset();
    dragState = {
        startY: clientY,
        startOffset: isCollapsed ? maxOffset : 0,
        maxOffset
    };

    document.body.classList.add('sidebar-dragging');
    sidebar.style.transform = `translateY(${dragState.startOffset}px)`;
}

function moveSidebarDrag(clientY) {
    if (!dragState || !sidebar) {
        return;
    }

    const deltaY = clientY - dragState.startY;
    const nextOffset = Math.min(dragState.maxOffset, Math.max(0, dragState.startOffset + deltaY));
    sidebar.style.transform = `translateY(${nextOffset}px)`;
    dragState.currentOffset = nextOffset;
}

function endSidebarDrag() {
    if (!dragState) {
        return;
    }

    const finalOffset = dragState.currentOffset ?? dragState.startOffset;
    const shouldCollapse = finalOffset > dragState.maxOffset * 0.45;
    dragState = null;
    setSidebarCollapsed(shouldCollapse);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function createMarkerIcon(location) {
    const priority = priorityMeta[location.priority] || priorityMeta[3];
    const label = location.nameChinese ? `${location.nameEnglish} / ${location.nameChinese}` : location.nameEnglish;
    const alwaysShowLabelClass = location.priority <= 2 ? 'marker-wrap--always-label' : '';

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div class="marker-wrap ${alwaysShowLabelClass}" data-marker-id="${location.id}">
                <svg class="marker-pin ${priority.markerClass}" viewBox="0 0 24 32" aria-hidden="true">
                    <path fill="currentColor" d="M12 0C5.373 0 0 5.373 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.373 18.627 0 12 0ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16Z"/>
                </svg>
                <span class="marker-label">${escapeHtml(label)}</span>
            </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -34]
    });
}

function popupMarkup(location) {
    const priority = priorityMeta[location.priority] || priorityMeta[3];
    return `
        <div>
            <h3>${escapeHtml(location.nameEnglish)}</h3>
            ${location.nameChinese ? `<h4>${escapeHtml(location.nameChinese)}</h4>` : ''}
            <p>${escapeHtml(location.descriptionEnglish)}</p>
            <p style="margin-top: 8px; color: #93a4bf;">${escapeHtml(priority.label)} / ${escapeHtml(priority.labelZh)}</p>
        </div>
    `;
}

function renderSelectedLocation(location) {
    const priority = priorityMeta[location.priority] || priorityMeta[3];
    const bilingualName = location.nameChinese ? `${escapeHtml(location.nameEnglish)} / ${escapeHtml(location.nameChinese)}` : escapeHtml(location.nameEnglish);
    const bilingualAddress = location.addressChinese ? `${escapeHtml(location.addressEnglish)} / ${escapeHtml(location.addressChinese)}` : escapeHtml(location.addressEnglish);
    const bilingualDescription = location.descriptionChinese ? `${escapeHtml(location.descriptionEnglish)} / ${escapeHtml(location.descriptionChinese)}` : escapeHtml(location.descriptionEnglish);

    selectedLocation.innerHTML = `
        <div class="selected-location__header">
            <span class="priority-pill ${priority.className}">${location.priority} · ${priority.label} / ${priority.labelZh}</span>
            <h3 class="selected-location__name">${escapeHtml(location.nameEnglish)}</h3>
            ${location.nameChinese ? `<div class="selected-location__names">${bilingualName}</div>` : ''}
        </div>
        <div class="selected-location__details">
            <div>
                <strong>Address</strong>
                <p>${bilingualAddress}</p>
            </div>
            <div>
                <strong>Location</strong>
                <p>${escapeHtml(location.area)}</p>
            </div>
            <div>
                <strong>Description</strong>
                <p>${bilingualDescription}</p>
            </div>
        </div>
    `;
}

function setActiveLocation(location, { openPopup = false, moveMap = true } = {}) {
    cards.forEach((card, id) => {
        card.classList.toggle('is-active', id === location.id);
        card.setAttribute('aria-pressed', id === location.id ? 'true' : 'false');
    });

    markers.forEach((marker, id) => {
        const icon = marker.getElement();
        if (icon) {
            icon.classList.toggle('is-open', id === location.id);
        }
    });

    renderSelectedLocation(location);

    if (moveMap) {
        map.flyTo([location.latitude, location.longitude], location.zoom ?? 16, {
            animate: true,
            duration: 1.2
        });
    }

    if (openPopup) {
        window.setTimeout(() => {
            markers.get(location.id)?.openPopup();
        }, 450);
    }

    if (isMobileLayout()) {
        setSidebarCollapsed(true);
    }
}

function createLocationCard(location) {
    const priority = priorityMeta[location.priority] || priorityMeta[3];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'location-card';
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `
        <div class="location-card__top">
            <div>
                <h3 class="location-card__title">${escapeHtml(location.nameEnglish)}</h3>
                ${location.nameChinese ? `<p class="location-card__meta">${escapeHtml(location.nameChinese)}</p>` : ''}
            </div>
            <span class="priority-pill ${priority.className}">${location.priority}</span>
        </div>
        <p class="location-card__address">${escapeHtml(location.addressEnglish)}</p>
        ${location.addressChinese ? `<p class="location-card__meta">${escapeHtml(location.addressChinese)}</p>` : ''}
    `;

    button.addEventListener('click', () => {
        setActiveLocation(location, { openPopup: true });
    });

    return button;
}

async function init() {
    try {
        syncSidebarMode();

        mobileSidebarToggle?.addEventListener('click', () => {
            setSidebarCollapsed(false);
            sidebar?.scrollTo({ top: 0, behavior: 'smooth' });
        });

        mobileSidebarBackdrop?.addEventListener('click', () => {
            setSidebarCollapsed(true);
        });

        sidebarGrabber?.addEventListener('pointerdown', (event) => {
            startSidebarDrag(event.clientY);
            sidebarGrabber.setPointerCapture(event.pointerId);
        });

        sidebarGrabber?.addEventListener('pointermove', (event) => {
            moveSidebarDrag(event.clientY);
        });

        sidebarGrabber?.addEventListener('pointerup', () => {
            endSidebarDrag();
        });

        sidebarGrabber?.addEventListener('pointercancel', () => {
            endSidebarDrag();
        });

        mobileMedia.addEventListener('change', () => {
            syncSidebarMode();
            map.invalidateSize();
        });

        const response = await fetch('./locations.json');
        if (!response.ok) {
            throw new Error(`Failed to load locations: ${response.status}`);
        }

        const locations = await response.json();
        locationCount.textContent = String(locations.length);

        locations.forEach((location) => {
            const marker = L.marker([location.latitude, location.longitude], {
                icon: createMarkerIcon(location)
            }).addTo(map);

            marker.bindPopup(popupMarkup(location));
            marker.on('click', () => {
                setActiveLocation(location, { openPopup: false });
            });

            markers.set(location.id, marker);

            const card = createLocationCard(location);
            cards.set(location.id, card);
            listContainer.appendChild(card);
        });

        const bounds = L.latLngBounds(locations.map((location) => [location.latitude, location.longitude]));
        map.fitBounds(bounds, { padding: [42, 42] });

        if (locations.length > 0) {
            setActiveLocation(locations[0], { openPopup: false, moveMap: false });
        }

        window.requestAnimationFrame(() => {
            map.invalidateSize();
        });

        window.addEventListener('resize', () => {
            map.invalidateSize();
        });
    } catch (error) {
        listContainer.innerHTML = '<p class="selected-location__empty">Unable to load locations.json. Check the file path and refresh.</p>';
        selectedLocation.innerHTML = '<p class="selected-location__empty">Location data could not be loaded.</p>';
        console.error(error);
    }
}

init();