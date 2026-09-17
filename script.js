'use strict';

/* =============================================
   CONFIGURAÇÃO DO SITE
   ============================================= */
const SITE_CONFIG = Object.freeze({
    name: "Kelvin Saldanha Mateus",
    github: "https://github.com/kelvinsaldanha",
    linkedin: "https://www.linkedin.com/in/kelvin-saldanha-mateus/",
    email: "kelvinsaldanhaa@gmail.com",
    currentYear: new Date().getFullYear()
});

/* =============================================
   FUNÇÕES UTILITÁRIAS
   ============================================= */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

function safeGet(key) {
    try {
        return localStorage.getItem(key);
    } catch (err) {
        return null;
    }
}

function safeSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (err) {
        /* modo privado / storage indisponível */
    }
}

/* =============================================
   FEATURE DETECTION
   ============================================= */
const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canHover =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* =============================================
   MENU MOBILE
   ============================================= */
const navToggle = $('#nav-toggle');
const navMenu = $('#nav-menu');
const nav = $('.nav');
const navOverlay = $('#nav-overlay');

if (navToggle && navMenu && nav) {
    let bodyOverflow = '';

    const toggleMenu = (force) => {
        const isOpen = force !== undefined
            ? force
            : !navMenu.classList.contains('active');

        if (isOpen) {
            bodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = bodyOverflow;
        }

        navMenu.classList.toggle('active', isOpen);
        nav.classList.toggle('active', isOpen);

        if (navOverlay) {
            navOverlay.classList.toggle('active', isOpen);
        }

        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute(
            'aria-label',
            isOpen ? 'Fechar menu' : 'Abrir menu'
        );
    };

    navToggle.addEventListener('click', () => toggleMenu());

    $$('.nav__link', navMenu).forEach((link) => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu(false);
                navToggle.focus();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu(false);
            navToggle.focus();
        }
    });

    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }
}

/* =============================================
   DARK MODE
   ============================================= */
const darkmodeToggle = $('#darkmode-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function getTheme() {
    const saved = safeGet('theme');
    if (saved) return saved;
    return prefersDark.matches ? 'dark' : 'light';
}

function updateDarkModeIcon(theme) {
    if (!darkmodeToggle) return;

    darkmodeToggle.setAttribute(
        'aria-pressed',
        String(theme === 'dark')
    );

    darkmodeToggle.setAttribute(
        'aria-label',
        theme === 'dark'
            ? 'Mudar para modo claro'
            : 'Mudar para modo escuro'
    );

    darkmodeToggle.innerHTML = theme === 'dark'
        ? '<span aria-hidden="true">☀️</span>'
        : '<span aria-hidden="true">🌙</span>';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    safeSet('theme', theme);
    updateDarkModeIcon(theme);
}

applyTheme(getTheme());

prefersDark.addEventListener('change', (e) => {
    if (!safeGet('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

if (darkmodeToggle) {
    darkmodeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
}

/* =============================================
   SMOOTH SCROLL (âncoras internas)
   ============================================= */
$$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = $(targetId);
        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
        });
    });
});

/* =============================================
   ANIMAÇÕES COM INTERSECTION OBSERVER + STAGGER
   ============================================= */
const animatedElements = $$(
    '.projeto-card, ' +
    '.area-card, ' +
    '.post-card, ' +
    '.timeline__item, ' +
    '.formacao-card, ' +
    '.contato-canal, ' +
    '.conquista-card, ' +
    '.certificado-card'
);

if (prefersReducedMotion) {
    animatedElements.forEach((el) => el.classList.add('visible'));
} else {
    const staggerSelectors = [
        '.projeto-card',
        '.post-card',
        '.area-card',
        '.certificado-card'
    ];

    let staggerIndex = 0;
    const staggerIndexMap = new WeakMap();

    animatedElements.forEach((el) => {
        el.classList.add('fade-in');

        if (staggerSelectors.some((s) => el.matches(s))) {
            staggerIndexMap.set(el, staggerIndex++);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            if (staggerIndexMap.has(entry.target)) {
                entry.target.style.transitionDelay =
                    ((staggerIndexMap.get(entry.target) % 6) * 0.05) + 's';
            }

            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach((el) => observer.observe(el));
}

/* =============================================
   SISTEMA "VER MAIS" PARA PUBLICAÇÕES
   ============================================= */
const publicacoesGrid = $('#publicacoes-grid');
const btnVerMais = $('#btn-ver-mais');
const POSTS_VISIVEIS_INICIAL = 6;

if (publicacoesGrid && btnVerMais) {
    let postsVisiveis = POSTS_VISIVEIS_INICIAL;

    btnVerMais.setAttribute('aria-live', 'polite');
    btnVerMais.setAttribute('aria-expanded', 'false');

    const atualizarVisibilidadePosts = () => {
        const cards = $$('.post-card', publicacoesGrid);
        const totalPosts = cards.length;

        cards.forEach((card, index) => {
            card.classList.toggle('hidden-card', index >= postsVisiveis);
        });

        if (totalPosts <= POSTS_VISIVEIS_INICIAL) {
            btnVerMais.style.display = 'none';
            return;
        }

        btnVerMais.style.display = '';
        btnVerMais.setAttribute(
            'aria-expanded',
            String(postsVisiveis >= totalPosts)
        );
        btnVerMais.textContent =
            postsVisiveis >= totalPosts ? 'Ver menos' : 'Ver mais';
    };

    btnVerMais.addEventListener('click', () => {
        const totalCards = $$('.post-card', publicacoesGrid).length;
        postsVisiveis =
            postsVisiveis < totalCards ? totalCards : POSTS_VISIVEIS_INICIAL;
        atualizarVisibilidadePosts();
    });

    atualizarVisibilidadePosts();
}

/* =============================================
   TRATAMENTO DE ERROS DE IMAGEM
   ============================================= */
function handleImageError(img) {
    const parent = img.parentElement;
    if (!parent) return;

    const wrappers = [
        'hero__image-wrapper',
        'projeto-card__image-wrapper',
        'post-card__image-wrapper',
        'conquista-card__imagem',
        'certificado-card__imagem',
        'figura-card__imagem'
    ];

    if (!wrappers.some((className) => parent.classList.contains(className))) {
        return;
    }

    img.remove();
    parent.classList.add('img-error');
    parent.setAttribute('aria-label', 'Imagem indisponível');
}

$$('img').forEach((img) => {
    img.addEventListener('error', () => handleImageError(img), { once: true });
});

/* =============================================
   ANO AUTOMÁTICO NO FOOTER
   ============================================= */
const anoElement = $('#ano-atual');
if (anoElement) {
    anoElement.textContent = SITE_CONFIG.currentYear;
}

/* =============================================
   BOTÃO VOLTAR AO TOPO
   ============================================= */
const backToTopBtn = $('#back-to-top');

if (backToTopBtn) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 300);
            ticking = false;
        });
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
}

/* =============================================
   LIGHTBOX
   ============================================= */
(function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const imagem = document.getElementById('lightbox-imagem');
    const legenda = document.getElementById('lightbox-legenda');
    const contador = document.getElementById('lightbox-contador');
    const fechar = document.getElementById('lightbox-fechar');
    const anterior = document.getElementById('lightbox-anterior');
    const proximo = document.getElementById('lightbox-proximo');

    if (!imagem || !legenda || !contador || !fechar) return;

    let itens = [];
    let indiceAtual = 0;
    let elementoAnterior = null;
    let lightboxBodyOverflow = '';

    function abrirLightbox(index) {
        if (!itens.length) return;

        if (index < 0) index = itens.length - 1;
        if (index >= itens.length) index = 0;

        indiceAtual = index;
        const item = itens[indiceAtual];

        imagem.src = item.src;
        imagem.alt = item.alt || '';
        legenda.textContent = item.legenda || item.alt || 'Imagem';
        contador.textContent = `${indiceAtual + 1} / ${itens.length}`;

        elementoAnterior = document.activeElement;
        lightboxBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        lightbox.classList.add('lightbox--ativo');
        fechar.focus();
    }

    function fecharLightbox() {
        lightbox.classList.remove('lightbox--ativo');
        document.body.style.overflow = lightboxBodyOverflow;

        if (elementoAnterior && typeof elementoAnterior.focus === 'function') {
            elementoAnterior.focus();
        }
        elementoAnterior = null;
    }

    function navegar(delta) {
        abrirLightbox(indiceAtual + delta);
    }

    function configurarListaPadrao() {
        const imagens = document.querySelectorAll(
            '.post-card__image, .figura-card img'
        );

        itens = Array.from(imagens)
            .filter((img) => img.src && !img.src.includes('undefined'))
            .map((img) => ({
                src: img.src,
                alt: img.alt || '',
                legenda:
                    img.getAttribute('data-legenda') ||
                    img.alt ||
                    ''
            }));
    }

    fechar.addEventListener('click', fecharLightbox);

    if (anterior) {
        anterior.addEventListener('click', (e) => {
            e.stopPropagation();
            navegar(-1);
        });
    }

    if (proximo) {
        proximo.addEventListener('click', (e) => {
            e.stopPropagation();
            navegar(1);
        });
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) fecharLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('lightbox--ativo')) return;

        if (e.key === 'Escape') fecharLightbox();
        if (e.key === 'ArrowLeft') navegar(-1);
        if (e.key === 'ArrowRight') navegar(1);
    });

    lightbox.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const focaveis = lightbox.querySelectorAll(
            'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        if (!focaveis.length) return;

        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];

        if (e.shiftKey && document.activeElement === primeiro) {
            e.preventDefault();
            ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
            e.preventDefault();
            primeiro.focus();
        }
    });

    window.addEventListener('pageshow', () => {
        document.body.style.overflow = '';
        lightbox.classList.remove('lightbox--ativo');
    });

    /* Abertura por CustomEvent (usada pelo carrossel) */
    document.addEventListener('lightbox:open', (e) => {
        const detail = e.detail || {};
        if (!Array.isArray(detail.items) || !detail.items.length) return;

        itens = detail.items;
        abrirLightbox(detail.index || 0);
    });

    /* Clique nas imagens normais (posts e figuras) */
    document
        .querySelectorAll('.post-card__image, .figura-card img')
        .forEach((img) => {
            if (img.closest('.carrossel-container')) return;

            img.style.cursor = 'pointer';
            img.addEventListener('click', function (e) {
                e.preventDefault();
                configurarListaPadrao();

                const index = itens.findIndex(
                    (item) => item.src === this.src
                );
                abrirLightbox(index !== -1 ? index : 0);
            });
        });
})();

/* =============================================
   EFEITO 3D TILT NOS CARDS DE PROJETO
   ============================================= */
if (canHover && !prefersReducedMotion) {
    $$('.projeto-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();

            const rotateX =
                ((e.clientY - rect.top - rect.height / 2) / 40) * -1;
            const rotateY =
                (e.clientX - rect.left - rect.width / 2) / 40;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.transition = 'transform 0.1s ease-out';
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            card.style.transform =
                'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            card.style.transition = 'transform 0.4s ease-out';
        });
    });
}

/* =============================================
   PARALLAX NO HERO
   ============================================= */
if (canHover && !prefersReducedMotion) {
    const heroImage = $('.hero__image-wrapper');

    if (heroImage) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                heroImage.style.transform =
                    `translateY(${window.scrollY * 0.08}px)`;
                ticking = false;
            });
        }, { passive: true });
    }
}

/* =============================================
   TRANSIÇÃO DE PÁGINA (FADE OUT / IN)
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.remove('is-loading');
    document.documentElement.classList.add('is-loaded');
});

document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    if (link.target === '_blank') return;
    if (link.hasAttribute('download')) return;

    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#')) return;

    if (!link.href.startsWith(window.location.origin)) return;

    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    if (prefersReducedMotion) return;

    if (/\.(pdf|zip|png|jpe?g|webp|svg|mp4|mp3)$/i.test(link.pathname)) return;

    e.preventDefault();

    document.body.classList.add('is-leaving');

    setTimeout(() => {
        window.location.href = link.href;
    }, 200);
});

window.addEventListener('pageshow', () => {
    document.body.classList.remove('is-leaving');
    document.documentElement.classList.remove('is-loading');
    document.documentElement.classList.add('is-loaded');
});

/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
(function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    progressBar.setAttribute('role', 'presentation');
    document.body.appendChild(progressBar);

    let ticking = false;

    function updateProgress() {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const h =
                document.documentElement.scrollHeight - window.innerHeight;

            progressBar.style.width =
                (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';

            ticking = false;
        });
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    document.addEventListener('DOMContentLoaded', updateProgress);
})();

/* =============================================
   CARROSSEL (com swipe e teclado)
   ============================================= */
document.querySelectorAll('.carrossel-container').forEach((container) => {
    const slides = container.querySelectorAll('.carrossel-slide');
    const contador = container.querySelector('.carrossel-contador');
    const btnEsq = container.querySelector('.carrossel-btn-esquerda');
    const btnDir = container.querySelector('.carrossel-btn-direita');

    if (!slides.length) return;

    let index = 0;
    const total = slides.length;
    let suppressClick = false;

    function atualizarCarrossel() {
        slides.forEach((slide, i) => {
            const active = i === index;
            slide.classList.toggle('active', active);
            slide.setAttribute('aria-hidden', String(!active));
        });

        if (contador) {
            contador.textContent = `${index + 1} / ${total}`;
        }
    }

    function irPara(direcao) {
        index = (index + direcao + total) % total;
        atualizarCarrossel();
    }

    function abrirLightboxCarrossel() {
        const listaCarrossel = [];

        slides.forEach((slide) => {
            const src = slide.getAttribute('src');
            const alt = slide.getAttribute('alt') || '';
            const legenda = slide.getAttribute('data-legenda') || alt;

            if (src && !src.includes('undefined')) {
                listaCarrossel.push({ src, alt, legenda });
            }
        });

        if (!listaCarrossel.length) return;

        document.dispatchEvent(
            new CustomEvent('lightbox:open', {
                detail: { items: listaCarrossel, index }
            })
        );
    }

    /* Clique na imagem ativa (abre lightbox); ignora se for swipe */
    container.addEventListener('click', (e) => {
        if (suppressClick) {
            suppressClick = false;
            return;
        }

        if (
            e.target.closest('.carrossel-btn') ||
            e.target.closest('.carrossel-contador')
        ) {
            return;
        }

        if (e.target.closest('.carrossel-slide')) {
            e.preventDefault();
            e.stopPropagation();
            abrirLightboxCarrossel();
        }
    });

    if (btnEsq) {
        btnEsq.addEventListener('click', (e) => {
            e.stopPropagation();
            irPara(-1);
        });
    }

    if (btnDir) {
        btnDir.addEventListener('click', (e) => {
            e.stopPropagation();
            irPara(1);
        });
    }

    /* Swipe (touch / pen) */
    let startX = 0;
    let isDragging = false;

    container.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse') return;

        startX = e.clientX;
        isDragging = true;
        suppressClick = false;
    });

    container.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const delta = e.clientX - startX;
        if (Math.abs(delta) < 40) return;

        irPara(delta > 0 ? -1 : 1);
        suppressClick = true;
    });

    container.addEventListener('pointercancel', () => {
        isDragging = false;
    });

    /* Navegação por teclado */
    container.setAttribute('tabindex', '0');

    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            irPara(-1);
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            irPara(1);
        }
    });

    atualizarCarrossel();
});
