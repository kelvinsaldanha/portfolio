# 🚀 Portfólio — Kelvin Saldanha Mateus

![GitHub repo size](https://img.shields.io/github/repo-size/Kelvinsaldanha/portfolio)
![GitHub stars](https://img.shields.io/github/stars/Kelvinsaldanha/portfolio?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/Kelvinsaldanha/portfolio)
![GitHub license](https://img.shields.io/github/license/Kelvinsaldanha/portfolio)

Bem-vindo ao repositório do meu portfólio pessoal! Este site foi desenvolvido para apresentar meus projetos, experiências, formação acadêmica e publicações na área de **Equipamentos Biomédicos** e **Tecnologia**. O projeto é construído com foco em **performance**, **acessibilidade** e **design responsivo**.

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
| :--- | :--- |
| 🌙 **Modo Escuro (Dark Mode)** | Suporte nativo com detecção de preferência do sistema (via `prefers-color-scheme`) e persistência da escolha do usuário com `localStorage`. |
| 📱 **Design Responsivo** | Layout otimizado para celulares, tablets e desktops, com breakpoints cuidadosos e grid/flexbox. |
| 🍔 **Menu Mobile Intuitivo** | Menu hambúrguer com animações suaves, suporte a gestos (swipe) e fechamento com tecla `Escape`. |
| ✨ **Animações de Entrada** | Efeitos de *fade-in* ao rolar a página, utilizando `IntersectionObserver` para performance. |
| 🎴 **Efeito Cascade (Stagger)** | Entrada fluida e escalonada nos cards de projetos, publicações e conquistas. |
| 📚 **Sistema "Ver Mais"** | Exibição progressiva de publicações, carregando mais conteúdo sob demanda. |
| 🔝 **Botão "Voltar ao Topo"** | Aparece dinamicamente após um certo scroll, com rolagem suave. |
| 🖼️ **Lightbox** | Ampliação de imagens em projetos e publicações, com navegação por teclado (setas e `Escape`). |
| ♿ **Acessibilidade** | Links de salto (*skip-links*), ARIA labels, foco visível e tratamento de imagens quebradas. |
| 🔍 **SEO Otimizado** | Meta tags, Open Graph, Twitter Cards, JSON-LD, `sitemap.xml` e `robots.txt`. |
| 📄 **Página 404 Personalizada** | Experiência de erro amigável e funcional, com links para outras seções. |

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
| :--- | :--- |
| **HTML5** | Estrutura semântica das páginas, garantindo boa acessibilidade e SEO. |
| **CSS3** | Estilização avançada com variáveis nativas, Flexbox, Grid, animações e temas claro/escuro. |
| **JavaScript (ES6+)** | Interatividade, manipulação de DOM, APIs nativas e lógica de configuração, sem dependências externas. |
| **Jekyll** | Gerador de sites estáticos que permite reutilizar layouts (`_layouts`), componentes (`_includes`) e dados estruturados (`_data`). |
| **Git & GitHub** | Controle de versão distribuído e hospedagem gratuita via GitHub Pages. |
| **Google Fonts** | Tipografia moderna e legível (fonte Inter). |
| **Devicon & Font Awesome** | Ícones para exibir tecnologias e ferramentas de forma visual. |

---

## 📁 Estrutura do Projeto

A organização dos arquivos foi pensada para ser **modular**, **fácil de navegar** e **escalável**:

```text
/
├── _data/                 # Dados estruturados (ex: conquistas.yml)
│   └── conquistas.yml     # Lista de medalhas e reconhecimentos
├── _includes/             # Partials reutilizáveis (Jekyll)
│   ├── footer.html        # Rodapé do site
│   └── navbar.html        # Navegação principal
├── _layouts/              # Layouts base (Jekyll)
│   └── default.html       # Layout padrão com head, header e footer
├── images/                # Ativos visuais organizados por categoria
│   ├── profile/           # Fotos de perfil
│   ├── projects/          # Imagens dos projetos
│   ├── posts/             # Imagens das publicações
│   └── conquistas/        # Imagens das medalhas/certificados
├── index.html             # Página inicial (Home)
├── sobre.html             # Sobre o autor (formação, experiências, interesses)
├── projetos.html          # Galeria de projetos
├── habilidades.html       # Habilidades técnicas
├── publicacoes.html       # Artigos e posts
├── conquistas.html        # Prêmios e reconhecimentos
├── contato.html           # Canais de comunicação
├── 404.html               # Página de erro personalizada
├── este-portfolio.html    # Detalhes sobre o desenvolvimento deste site
├── eye-tracker.html       # Projeto Eye Tracker CK²
├── monitor-multiparametrico.html  # Projeto Monitor Multiparamétrico
├── guia-respiracao.html   # Projeto Guia de Respiração
├── style.css              # Estilização global e responsividade
├── script.js              # Lógica, animações e configurações
├── sitemap.xml            # Mapa do site para SEO
├── robots.txt             # Instruções para rastreadores
├── _config.yml            # Configuração do Jekyll
├── Gemfile                # Dependências Ruby
├── Gemfile.lock           # Versões travadas das dependências
└── README.md              # Documentação do projeto
