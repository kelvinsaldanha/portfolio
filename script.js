/* =============================================
   CONFIGURAÇÃO DO SITE
   Altere esses dados conforme necessário.
   ============================================= */
const SITE_CONFIG = {
    name: "Kelvin Saldanha Mateus",
    github: "https://github.com/Kelvinsaldanha",
    linkedin: "https://www.linkedin.com/in/kelvin-saldanha-mateus/",
    email: "kelvinsaldanhaa@gmail.com",
    currentYear: 2026
};

/* =============================================
   FUNÇÕES UTILITÁRIAS
   ============================================= */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/* =============================================
   MENU MOBILE
   ============================================= */
const header = $('.header');
const navToggle = $('#nav-toggle');
const navMenu = $('#nav-menu');
const nav = $('.nav');

function toggleMenu(force) {
    const isOpen = force !== undefined ? force : !navMenu.classList.contains('active');
    navMenu.classList.toggle('active', isOpen);
    nav.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

navToggle.addEventListener('click', () => toggleMenu());

// Fechar menu ao clicar em um link
$$('.nav__link', navMenu).forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});

// Fechar menu com tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu(false);
        navToggle.focus();
    }
});

// Fechar menu ao clicar fora (overlay)
nav.addEventListener('click', (e) => {
    if (e.target === nav && navMenu.classList.contains('active')) {
        toggleMenu(false);
    }
});

/* =============================================
   PÁGINA ATIVA
   ============================================= */
function destacarPaginaAtiva() {
    const path = window.location.pathname;
    const pagina = path.split('/').pop() || 'index.html';
    $$('.nav__link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === pagina) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

destacarPaginaAtiva();

/* =============================================
   DARK MODE
   ============================================= */
const darkmodeToggle = $('#darkmode-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function getTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return prefersDark.matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateDarkModeIcon(theme);
}

function updateDarkModeIcon(theme) {
    if (darkmodeToggle) {
        darkmodeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        darkmodeToggle.setAttribute('aria-label', theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro');
    }
}

// Inicializar tema
applyTheme(getTheme());

if (darkmodeToggle) {
    darkmodeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
}

/* =============================================
   SMOOTH SCROLL (para âncoras)
   ============================================= */
$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = $(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* =============================================
   ANIMAÇÕES COM INTERSECTION OBSERVER
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

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animatedElements.forEach(el => {
    observer.observe(el);
});

/* =============================================
   SISTEMA "VER MAIS" PARA PUBLICAÇÕES
   (Somente na página publicacoes.html)
   ============================================= */
const publicacoesGrid = $('#publicacoes-grid');
const btnVerMais = $('#btn-ver-mais');
const POSTS_VISIVEIS_INICIAL = 6;

if (publicacoesGrid && btnVerMais) {
    let postsVisiveis = POSTS_VISIVEIS_INICIAL;

    function atualizarVisibilidadePosts() {
        const cards = $$('.post-card', publicacoesGrid);
        cards.forEach((card, index) => {
            if (index >= postsVisiveis) {
                card.classList.add('hidden-card');
            } else {
                card.classList.remove('hidden-card');
            }
        });

        const totalPosts = cards.length;
        if (totalPosts <= POSTS_VISIVEIS_INICIAL) {
            btnVerMais.style.display = 'none';
        } else if (postsVisiveis >= totalPosts) {
            btnVerMais.textContent = 'Ver menos';
        } else {
            btnVerMais.textContent = 'Ver mais';
        }
    }

    btnVerMais.addEventListener('click', () => {
        const totalCards = $$('.post-card', publicacoesGrid).length;
        if (postsVisiveis < totalCards) {
            postsVisiveis = totalCards;
        } else {
            postsVisiveis = POSTS_VISIVEIS_INICIAL;
        }
        atualizarVisibilidadePosts();
    });

    atualizarVisibilidadePosts();
}

/* =============================================
   IMAGENS QUEBRADAS (fallback)
   ============================================= */
function handleImageError(img) {
    img.classList.add('img-error');
    const parent = img.parentElement;
    if (parent && parent.classList.contains('hero__image-wrapper')) {
        parent.classList.add('img-error');
    } else if (parent && (parent.classList.contains('projeto-card__image-wrapper') || parent.classList.contains('post-card__image-wrapper'))) {
        parent.style.background = 'var(--color-surface-light)';
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        const placeholder = document.createElement('span');
        placeholder.textContent = 'Imagem indisponível';
        placeholder.style.color = 'var(--color-text-muted)';
        placeholder.style.fontSize = '0.9rem';
        parent.appendChild(placeholder);
    }
}

document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        handleImageError(e.target);
    }
}, true);

/* =============================================
   ANO AUTOMÁTICO NO FOOTER
   ============================================= */
const anoElement = $('#ano-atual');
if (anoElement) {
    anoElement.textContent = SITE_CONFIG.currentYear || new Date().getFullYear();
}

/* =============================================
   BOTÃO VOLTAR AO TOPO
   ============================================= */
const backToTopBtn = $('#back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* =============================================
   CONFIGURAÇÃO DOS LINKS DO FOOTER
   (Substitui placeholders por valores reais se existirem)
   ============================================= */
function configurarLinksFooter() {
    const linkedinLink = $('#linkedin-link');
    const emailLink = $('#email-link');
    const footerGithubLink = $('#footer-github-link');

    if (linkedinLink && SITE_CONFIG.linkedin) {
        linkedinLink.href = SITE_CONFIG.linkedin;
    } else if (linkedinLink) {
        // Placeholder: link vazio ou "#"
        linkedinLink.href = '#';
        linkedinLink.setAttribute('aria-disabled', 'true');
    }

    if (emailLink && SITE_CONFIG.email) {
        emailLink.href = `mailto:${SITE_CONFIG.email}`;
    } else if (emailLink) {
        emailLink.href = '#';
        emailLink.setAttribute('aria-disabled', 'true');
    }

    if (footerGithubLink && SITE_CONFIG.github) {
        footerGithubLink.href = SITE_CONFIG.github;
    }
}

configurarLinksFooter();

/* =============================================
   LIGHTBOX GENÉRICO (funciona em todas as páginas)
   ============================================= */
(function() {

    // Seleciona todas as imagens que devem abrir o lightbox
    const imagens = document.querySelectorAll(
        '.post-card__image, .figura-card img'
    );

    // Filtra apenas as que têm src válido
    const itens = Array.from(imagens).filter(img => img.src && !img.src.includes('undefined'));

    if (itens.length === 0) return;

    const lightbox = document.getElementById('lightbox');
    const imagem = document.getElementById('lightbox-imagem');
    const legenda = document.getElementById('lightbox-legenda');
    const contador = document.getElementById('lightbox-contador');
    const fechar = document.getElementById('lightbox-fechar');
    const anterior = document.getElementById('lightbox-anterior');
    const proximo = document.getElementById('lightbox-proximo');

    let indiceAtual = 0;

    function abrirLightbox(index) {
        if (index < 0) index = itens.length - 1;
        if (index >= itens.length) index = 0;

        indiceAtual = index;
        const img = itens[indiceAtual];
        imagem.src = img.src;
        imagem.alt = img.alt || '';

        // Tenta pegar a legenda
        let legendaTexto = img.getAttribute('data-legenda') || img.alt || '';
        
        // Se for figura-card, pega a legenda do elemento irmão
        const card = img.closest('.figura-card');
        if (card) {
            const legElem = card.querySelector('.figura-card__legenda');
            if (legElem) legendaTexto = legElem.textContent.trim();
        }
        // Se for post-card, pega o título do post
        const postCard = img.closest('.post-card');
        if (postCard) {
            const titulo = postCard.querySelector('.post-card__title');
            if (titulo) legendaTexto = titulo.textContent.trim();
        }

        legenda.textContent = legendaTexto || 'Imagem';
        contador.textContent = `${indiceAtual + 1} / ${itens.length}`;

        lightbox.classList.add('lightbox--ativo');
        document.body.style.overflow = 'hidden';
    }

    function fecharLightbox() {
        lightbox.classList.remove('lightbox--ativo');
        document.body.style.overflow = '';
    }

    function navegar(delta) {
        abrirLightbox(indiceAtual + delta);
    }

    // Adiciona evento de clique em cada imagem
    itens.forEach((img, idx) => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            abrirLightbox(idx);
        });
        img.style.cursor = 'pointer';
    });

    // Eventos dos controles
    fechar.addEventListener('click', fecharLightbox);
    anterior.addEventListener('click', (e) => { e.stopPropagation(); navegar(-1); });
    proximo.addEventListener('click', (e) => { e.stopPropagation(); navegar(1); });

    // Fechar ao clicar no fundo
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) fecharLightbox();
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('lightbox--ativo')) return;
        if (e.key === 'Escape') fecharLightbox();
        if (e.key === 'ArrowLeft') navegar(-1);
        if (e.key === 'ArrowRight') navegar(1);
    });

})();

// ============================================
// EFEITO 3D TILT NOS CARDS DE PROJETO (SUAVIZADO)
// ============================================
document.querySelectorAll('.projeto-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // 🔽 AUMENTE o divisor para reduzir o movimento (ex: 40, 50 ou 60)
    const rotateX = ((y - centerY) / 40) * -1; 
    const rotateY = (x - centerX) / 40;
    
    // Removi o 'scale(1.02)' para evitar zoom indesejado, mas você pode manter se gostar
    card.style.transform = 
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'transform 0.1s ease-out';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    card.style.transition = 'transform 0.4s ease-out';
  });
});

// ============================================
// PARALLAX SUTIL NO HERO
// ============================================
window.addEventListener('scroll', () => {
  const heroImage = document.querySelector('.hero__image-wrapper');
  if (!heroImage) return;
  
  const scrolled = window.pageYOffset;
  // Move a imagem 15% mais devagar que a rolagem (multiplicador 0.15)
  heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
});

// ============================================
// TRANSIÇÃO SUAVE DE PÁGINA (FADE OUT/IN)
// ============================================

// 1. Ao carregar a página, aplica o fade-in
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('is-loading');
  document.documentElement.classList.add('is-loaded');
});

// 2. Intercepta cliques em links internos
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  
  // Verifica se é um link interno (mesmo domínio, não tem target=_blank, não é âncora #)
  if (!link) return;
  if (link.target === '_blank') return;
  if (link.href.startsWith('#')) return;
  if (!link.href.startsWith(window.location.origin)) return;
  
  e.preventDefault(); // Impede o navegador de navegar imediatamente
  
  // Adiciona a classe de saída para esvainecer
  document.body.classList.add('is-leaving');
  
  // Espera a animação de fade terminar (400ms) e redireciona
  setTimeout(() => {
    window.location.href = link.href;
  }, 400);
});

// 3. Se o usuário usar o botão "Voltar" do navegador, a transição acontece do mesmo jeito
window.addEventListener('pageshow', () => {
  document.body.classList.remove('is-leaving');
  document.documentElement.classList.remove('is-loading');
  document.documentElement.classList.add('is-loaded');
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
(function() {
    // Cria o elemento da barra
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    // Atualiza a largura conforme a rolagem
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }

    // Atualiza ao rolar e também ao carregar a página
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress); // recalcula se a janela mudar
    document.addEventListener('DOMContentLoaded', updateProgress);
})();

// ============================================
// STAGGER (efeito cascata) nas animações de entrada
// ============================================

// Lista de seletores onde aplicar o stagger
const staggerSelectors = [
  '.projeto-card',
  '.post-card',
  '.area-card',
  '.certificado-card'
];

// Seleciona todos os elementos que têm a classe .fade-in
const allFadeElements = document.querySelectorAll('.fade-in');

// Para cada elemento, calculamos um atraso baseado no índice
allFadeElements.forEach((el, index) => {
  // Verifica se o elemento corresponde a algum seletor da lista
  const isStagger = staggerSelectors.some(selector => el.matches(selector));
  if (isStagger) {
    // Atraso progressivo: 0.05s por item (ajuste: 0.03 ~ 0.08)
    el.style.transitionDelay = (index * 0.05) + 's';
  }
});

// ============================================
// CARROSSEL COM LIGHTBOX E LEGENDA (CORRIGIDO)
// ============================================
document.querySelectorAll('.carrossel-container').forEach(container => {
    const slides = container.querySelectorAll('.carrossel-slide');
    const contador = container.querySelector('.carrossel-contador');
    const btnEsq = container.querySelector('.carrossel-btn-esquerda');
    const btnDir = container.querySelector('.carrossel-btn-direita');
    let index = 0;
    const total = slides.length;

    function atualizarCarrossel() {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        if (contador) {
            contador.textContent = `${index + 1} / ${total}`;
        }
    }

    function irPara(direcao) {
        index = (index + direcao + total) % total;
        atualizarCarrossel();
    }

    // ===== ABRIR LIGHTBOX COM A IMAGEM ATIVA =====
    function abrirLightboxComImagemAtiva() {
        const slideAtivo = container.querySelector('.carrossel-slide.active');
        if (!slideAtivo) return;

        const src = slideAtivo.getAttribute('src');
        const legenda = slideAtivo.getAttribute('data-legenda') || slideAtivo.getAttribute('alt') || 'Imagem';

        // Usa o lightbox existente (procura por uma função global)
        // Se houver uma função como 'openLightbox' ou 'abrirLightbox', use-a.
        if (typeof window.abrirLightbox === 'function') {
            // A função espera um índice ou uma URL? Vamos passar a URL.
            window.abrirLightbox(src, legenda);
        } else {
            // Fallback: cria um lightbox simples na hora
            criarLightboxSimples(src, legenda);
        }
    }

    // ===== CRIA UM LIGHTBOX SIMPLES (FALLBACK) =====
    function criarLightboxSimples(src, legenda) {
        // Verifica se já existe um lightbox
        let lightbox = document.getElementById('lightbox-custom');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'lightbox-custom';
            lightbox.style.position = 'fixed';
            lightbox.style.top = '0';
            lightbox.style.left = '0';
            lightbox.style.width = '100%';
            lightbox.style.height = '100%';
            lightbox.style.background = 'rgba(0,0,0,0.9)';
            lightbox.style.display = 'flex';
            lightbox.style.alignItems = 'center';
            lightbox.style.justifyContent = 'center';
            lightbox.style.zIndex = '9999';
            lightbox.style.cursor = 'pointer';
            lightbox.style.flexDirection = 'column';

            const img = document.createElement('img');
            img.style.maxWidth = '90%';
            img.style.maxHeight = '80%';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 0 30px rgba(0,0,0,0.8)';
            img.id = 'lightbox-custom-img';
            lightbox.appendChild(img);

            const leg = document.createElement('p');
            leg.style.color = '#fff';
            leg.style.marginTop = '1rem';
            leg.style.fontSize = '1.1rem';
            leg.style.textAlign = 'center';
            leg.id = 'lightbox-custom-legenda';
            lightbox.appendChild(leg);

            document.body.appendChild(lightbox);

            lightbox.addEventListener('click', function() {
                this.style.display = 'none';
                document.body.style.overflow = '';
            });

            // Tecla ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightbox.style.display !== 'none') {
                    lightbox.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }

        const imgEl = document.getElementById('lightbox-custom-img');
        const legEl = document.getElementById('lightbox-custom-legenda');
        if (imgEl) {
            imgEl.src = src;
            imgEl.alt = legenda;
        }
        if (legEl) {
            legEl.textContent = legenda;
        }
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // ===== EVENTO DE CLIQUE PARA ABRIR LIGHTBOX =====
    container.addEventListener('click', function(e) {
        // Se clicou em uma seta ou contador, ignora
        if (e.target.closest('.carrossel-btn') || e.target.closest('.carrossel-contador')) return;
        e.preventDefault(); // Impede qualquer comportamento padrão
        abrirLightboxComImagemAtiva();
    });

    // ===== EVENTOS DAS SETAS =====
    if (btnEsq) btnEsq.addEventListener('click', function(e) {
        e.stopPropagation();
        irPara(-1);
    });
    if (btnDir) btnDir.addEventListener('click', function(e) {
        e.stopPropagation();
        irPara(1);
    });

    // Inicializa
    atualizarCarrossel();
});
