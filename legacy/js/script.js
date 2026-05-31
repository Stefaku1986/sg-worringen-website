const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const pageContent = document.getElementById('page-content');

let pages = [];

function toggleMenu() {
  if (!siteNav) return;
  const isOpen = siteNav.classList.toggle('open');
  navToggle?.setAttribute('aria-expanded', String(isOpen));
}

function closeMenu() {
  if (!siteNav) return;
  siteNav.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

function normalizeRoute(hash) {
  const route = String(hash || '').replace(/^#+/, '').trim().toLowerCase();
  return route || 'home';
}

function findPage(route) {
  return pages.find((page) => page.id === route);
}

function cleanHtml(html) {
  return html
    .replace(/^<main[^>]*>/i, '')
    .replace(/<\/main>$/i, '')
    .replace(/\s(onerror|onload|onclick|style)=(".*?"|'.*?'|[^\s>]+)/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .trim();
}

function sanitizePageContent(container) {
  if (!container) return;
  container.querySelectorAll('img').forEach((img) => {
    img.removeAttribute('onerror');
    img.removeAttribute('onload');
    img.addEventListener('error', () => img.classList.add('image-broken'));
  });

  container.querySelectorAll('a').forEach((anchor) => {
    const href = anchor.getAttribute('href') || '';
    if (href.startsWith('#')) {
      anchor.setAttribute('data-internal', 'true');
    }
  });
}

function renderPage(page) {
  if (!pageContent) return;
  const contentHtml = cleanHtml(page.html);
  document.title = `${page.title} | SG Köln-Worringen Fußball`;

  const homeHero = page.id === 'home' ? `
    <section class="home-hero">
      <div class="container hero-inner">
        <div>
          <span class="eyebrow">Heimat für Fußball im Kölner Norden</span>
          <h2>Ein Verein. Viele Teams. Starker Zusammenhalt.</h2>
          <p>Alle Infos zur Abteilung, aktuellen News, Spielplänen und dem Vereinsleben jetzt in einem modernen Auftritt.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#mitmachen">Jetzt mitmachen</a>
            <a class="btn btn-secondary" href="#unser-verein">Zum Verein</a>
          </div>
        </div>
      </div>
    </section>
  ` : '';

  pageContent.innerHTML = `
    ${homeHero}
    <section class="page-shell">
      <div class="container page-header">
        <span class="eyebrow">Seite</span>
        <h1>${page.title}</h1>
      </div>
      <div class="page-body">${contentHtml}</div>
    </section>
  `;

  const pageBody = pageContent.querySelector('.page-body');
  sanitizePageContent(pageBody);

  const internalLinks = pageContent.querySelectorAll('a[data-internal="true"]');
  internalLinks.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const targetHash = anchor.getAttribute('href')?.replace(/^#+/, '');
      if (!targetHash) return;
      closeMenu();
      window.location.hash = targetHash;
    });
  });
}

function showNotFound(route) {
  if (!pageContent) return;
  document.title = `Seite nicht gefunden | SG Köln-Worringen Fußball`;
  pageContent.innerHTML = `
    <section class="page-shell">
      <div class="container page-header">
        <span class="eyebrow">Fehler</span>
        <h1>Seite nicht gefunden</h1>
        <p>Die Seite «${route}» konnte nicht geladen werden. Bitte wähle eine Seite aus der Navigation aus.</p>
      </div>
    </section>
  `;
}

function updateActiveNav(route) {
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const href = link.getAttribute('href')?.replace(/^#+/, '').toLowerCase();
    if (href === route) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function onRouteChange() {
  const route = normalizeRoute(window.location.hash);
  const page = findPage(route);
  if (page) {
    renderPage(page);
    updateActiveNav(page.id);
  } else {
    showNotFound(route);
  }
}

async function startApp() {
  try {
    const response = await fetch('data/spa_pages.json');
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Seiteninhalte');
    }
    pages = await response.json();
  } catch (error) {
    if (pageContent) {
      pageContent.innerHTML = `
        <div class="loading-state">
          <div class="container">
            <h2>Inhalte konnten nicht geladen werden</h2>
            <p>Bitte prüfen Sie Ihre Verbindung oder versuchen Sie es später erneut.</p>
          </div>
        </div>
      `;
    }
    console.error(error);
    return;
  }

  onRouteChange();
  window.addEventListener('hashchange', onRouteChange);
  document.body.addEventListener('click', (event) => {
    const anchor = event.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (href.startsWith('#')) {
      closeMenu();
    }
  });
}

navToggle?.addEventListener('click', toggleMenu);
startApp();
