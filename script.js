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
   LIGHTBOX GENÉRICO (com suporte a lista customizada)
   ============================================= */
(function() {
    // Elementos do lightbox
    const lightbox = document.getElementById('lightbox');
    const imagem = document.getElementById('lightbox-imagem');
    const legenda = document.getElementById('lightbox-legenda');
    const contador = document.getElementById('lightbox-contador');
    const fechar = document.getElementById('lightbox-fechar');
    const anterior = document.getElementById('lightbox-anterior');
    const proximo = document.getElementById('lightbox-proximo');

    // Lista global padrão (imagens dos posts e figuras)
    let itens = [];
    let indiceAtual = 0;

    // Função para atualizar a lista de itens (pode ser chamada pelo carrossel)
    function definirItens(novaLista) {
        itens = novaLista;
        indiceAtual = 0;
        // Se a lista for vazia, não faz nada
    }

    function abrirLightbox(index) {
        if (!itens || itens.length === 0) return;
        if (index < 0) index = itens.length - 1;
        if (index >= itens.length) index = 0;

        indiceAtual = index;
        const item = itens[indiceAtual];
        imagem.src = item.src;
        imagem.alt = item.alt || '';
        legenda.textContent = item.legenda || item.alt || 'Imagem';
        contador.textContent = `${indiceAtual + 1} / ${itens.length}`;

        lightbox.classList.add('lightbox--ativo');
        document.body.style.overflow = 'hidden';
    }

    function fecharLightbox() {
        lightbox.classList.remove('lightbox--ativo');
        document.body.style.overflow = '';
        // Restaura a lista padrão (opcional, mas bom para evitar conflitos)
        // Se quiser, pode restaurar a lista de imagens da página, mas não é necessário.
    }

    function navegar(delta) {
        abrirLightbox(indiceAtual + delta);
    }

    // === Configuração da lista padrão ===
    function configurarListaPadrao() {
        const imagens = document.querySelectorAll('.post-card__image, .figura-card img');
        const lista = Array.from(imagens)
            .filter(img => img.src && !img.src.includes('undefined'))
            .map(img => ({
                src: img.src,
                alt: img.alt || '',
                legenda: img.getAttribute('data-legenda') || img.alt || ''
            }));
        itens = lista;
        // Se houver itens, o primeiro será usado como fallback, mas não abrimos automaticamente.
    }

    // === Eventos dos controles ===
    fechar.addEventListener('click', fecharLightbox);
    anterior.addEventListener('click', (e) => { e.stopPropagation(); navegar(-1); });
    proximo.addEventListener('click', (e) => { e.stopPropagation(); navegar(1); });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) fecharLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('lightbox--ativo')) return;
        if (e.key === 'Escape') fecharLightbox();
        if (e.key === 'ArrowLeft') navegar(-1);
        if (e.key === 'ArrowRight') navegar(1);
    });

    // === Inicialização ===
    configurarListaPadrao();

    // === Expor funções para serem usadas pelo carrossel ===
    window.__lightbox = {
        abrir: abrirLightbox,
        definirItens: definirItens,
        fechar: fecharLightbox
    };

    // Também mantemos o clique automático nas imagens padrão (para posts normais)
    document.querySelectorAll('.post-card__image, .figura-card img').forEach((img, idx) => {
        // Só adiciona se não estiver dentro de um carrossel (para evitar duplicidade)
        if (!img.closest('.carrossel-container')) {
            img.addEventListener('click', function(e) {
                e.preventDefault();
                // Configura a lista padrão novamente (caso tenha sido modificada)
                configurarListaPadrao();
                // Encontra o índice correto na lista
                const index = itens.findIndex(item => item.src === this.src);
                if (index !== -1) {
                    abrirLightbox(index);
                } else {
                    // fallback: usa o primeiro item
                    abrirLightbox(0);
                }
            });
            img.style.cursor = 'pointer';
        }
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

    // ===== ABRIR LIGHTBOX =====
    function abrirLightboxCarrossel() {
        const slideAtivo = container.querySelector('.carrossel-slide.active');
        if (!slideAtivo) return;

        const src = slideAtivo.getAttribute('src');
        const legenda = slideAtivo.getAttribute('data-legenda') || slideAtivo.getAttribute('alt') || 'Imagem';

        // Usa o lightbox que já existe no HTML
        const lightbox = document.getElementById('lightbox');
        const imagem = document.getElementById('lightbox-imagem');
        const legendaEl = document.getElementById('lightbox-legenda');
        const contadorEl = document.getElementById('lightbox-contador');

        if (lightbox && imagem) {
            imagem.src = src;
            imagem.alt = legenda;
            if (legendaEl) legendaEl.textContent = legenda;
            if (contadorEl) contadorEl.textContent = ''; // não mostra contador no lightbox, só a legenda
            lightbox.classList.add('lightbox--ativo');
            document.body.style.overflow = 'hidden';
        } else {
            // Fallback seguro: se o lightbox não existir, não faz nada
            console.warn('Lightbox não encontrado.');
        }
    }

    // ===== EVENTO DE CLIQUE NA IMAGEM ATIVA =====
    container.addEventListener('click', (e) => {
        // Ignora cliques nas setas e no contador
        if (e.target.closest('.carrossel-btn') || e.target.closest('.carrossel-contador')) return;
        // Se clicou na imagem (ou no container), abre o lightbox
        if (e.target.closest('.carrossel-slide')) {
            e.preventDefault();
            e.stopPropagation();
            abrirLightboxCarrossel();
        }
    });

    // ===== SETAS =====
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

    // Inicializa
    atualizarCarrossel();
});
