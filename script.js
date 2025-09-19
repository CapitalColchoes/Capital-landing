// Configurações
const WHATSAPP_NUMBER = '5515996266288';

// Função para abrir WhatsApp com produto
function abrirWhatsApp(produto) {
    const mensagem = encodeURIComponent(`Olá! Tenho interesse no produto: ${produto}. Gostaria de mais informações.`);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`;
    window.open(url, '_blank');
}

// Função para abrir WhatsApp sem produto
function abrirWhatsAppSemProduto() {
    const mensagem = encodeURIComponent(`Olá! Estava navegando na página da loja e gostaria de mais informações.`);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`;
    window.open(url, '_blank');
}

// Função para scroll suave até seção
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Atualizar navegação ativa
        updateActiveNavigation(sectionId);
    }
}

// Função para atualizar navegação ativa
function updateActiveNavigation(activeSection) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === activeSection) {
            item.classList.add('active');
        }
    });
}

// Função para download de catálogos
function downloadCatalogo(fornecedor) {
    const fornecedores = {
        'fa': 'FA',
        'luckspuma': 'Luckspuma',
        'ortobom': 'Ortobom',
        'castor': 'Castor'
    };
    
    const nomeFornecedor = fornecedores[fornecedor];
    const caminhoArquivo = `https://github.com/CapitalColchoes/Capital-landing/releases/download/v1.0/${fornecedor}-catalogo.pdf`;

    try {
        window.open(caminhoArquivo, '_blank');
        console.log(`Catálogo ${nomeFornecedor} aberto em nova aba.`);
    } catch (error) {
        alert(`Não foi possível abrir o catálogo ${nomeFornecedor}. Por favor, entre em contato  WhatsApp!`);
    }
}

// Função para detectar seção visível e atualizar navegação
function detectVisibleSection() {
    const sections = ['pronta-entrega', 'complementos', 'catalogos'];
    const scrollPosition = window.scrollY + 200; // Offset para melhor detecção
    
    let activeSection = 'pronta-entrega'; // Padrão
    
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                activeSection = sectionId;
            }
        }
    });
    
    updateActiveNavigation(activeSection);
}

// Função para adicionar listeners de navegação
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            scrollToSection(sectionId);
        });
    });
    
    // Detectar seção visível durante scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(detectVisibleSection, 100);
    });
}

// Animações ao scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.produto-card, .catalogo-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Função para mostrar loading nos botões
function showButtonLoading(button, originalText) {
    button.disabled = true;
    button.innerHTML = `
        <svg class="loading-spinner" viewBox="0 0 24 24" fill="currentColor" style="width: 20px; height: 20px; animation: spin 1s linear infinite;">
            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
        </svg>
        Carregando...
    `;
    
    setTimeout(() => {
        button.disabled = false;
        button.innerHTML = originalText;
    }, 1500);
}

// Adicionar efeito de loading aos botões WhatsApp
function addLoadingToWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    
    whatsappButtons.forEach(button => {
        const originalHTML = button.innerHTML;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showButtonLoading(this, originalHTML);
            
            setTimeout(() => {
                const produto = this.closest('.produto-card').querySelector('.produto-nome').textContent;
                abrirWhatsApp(produto);
            }, 1000);
        });
    });
}

// Adicionar efeito de loading aos botões de download
function addLoadingToDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        const originalHTML = button.innerHTML;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showButtonLoading(this, originalHTML);
            
            setTimeout(() => {
                const fornecedor = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                downloadCatalogo(fornecedor);
            }, 1000);
        });
    });
}

// Função para adicionar efeito de hover nas imagens
function addImageHoverEffect() {
    const images = document.querySelectorAll('.produto-image img');
    
    images.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1) contrast(1.1)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.filter = 'none';
        });
    });
}

// CSS para animação de loading
const loadingCSS = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-spinner {
        animation: spin 1s linear infinite;
    }
`;

// Adicionar CSS de loading ao documento
function addLoadingCSS() {
    const style = document.createElement('style');
    style.textContent = loadingCSS;
    document.head.appendChild(style);
}

// Função para lazy loading das imagens
function lazyLoadImages() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = () => {
                    img.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Função para adicionar efeito de parallax suave no header
function addParallaxEffect() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        
        if (header && scrolled < window.innerHeight) {
            const rate = scrolled * -0.3;
            header.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxUpdate);
}

// Função para adicionar efeito de digitação no slogan
function addTypewriterEffect() {
    const slogan = document.querySelector('.slogan');
    if (!slogan) return;
    
    const text = slogan.textContent;
    slogan.textContent = '';
    slogan.style.borderRight = '2px solid white';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            slogan.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            setTimeout(() => {
                slogan.style.borderRight = 'none';
            }, 500);
        }
    }, 80);
}

// Função para otimizar performance
function optimizePerformance() {
    // Debounce para eventos de scroll
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 16); // ~60fps
    });
}

// Função para adicionar micro-interações
function addMicroInteractions() {
    // Efeito de ripple nos botões
    const buttons = document.querySelectorAll('.whatsapp-btn, .download-btn, .footer-whatsapp');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // CSS para animação de ripple
    const rippleCSS = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = rippleCSS;
    document.head.appendChild(style);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    setupNavigation();
    animateOnScroll();
    addLoadingCSS();
    addLoadingToWhatsAppButtons();
    addLoadingToDownloadButtons();
    addImageHoverEffect();
    lazyLoadImages();
    addMicroInteractions();
    optimizePerformance();
    
    // Efeitos opcionais (descomente se desejar)
    // addTypewriterEffect();
    // addParallaxEffect();
    
    // Detectar seção inicial
    setTimeout(detectVisibleSection, 100);
    
    console.log('Capital Colchões - Landing Page Refinada carregada com sucesso!');
});

// Função para smooth scroll em navegadores mais antigos
if (!('scrollBehavior' in document.documentElement.style)) {
    function smoothScrollTo(element) {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Substituir scrollToSection para navegadores antigos
    window.scrollToSection = function(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            smoothScrollTo(element);
            updateActiveNavigation(sectionId);
        }
    };
}



// Função para filtrar produtos por categoria
function filtrarProdutos(categoria) {
    const produtos = document.querySelectorAll(".produto-card");
    
    produtos.forEach(produto => {
        const categorias = produto.getAttribute("data-categoria").split(" ");
        
        if (categoria === "todos" || categorias.includes(categoria)) {
            produto.style.display = "block";
        } else {
            produto.style.display = "none";
        }
    });
}

// Função para atualizar filtro ativo
function updateActiveFiltro(filtroAtivo) {
    const filtroItems = document.querySelectorAll('.filtro-item');
    
    filtroItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-filtro') === filtroAtivo) {
            item.classList.add('active');
        }
    });
}

// Função para configurar filtros de colchões
function setupFiltrosColchoes() {
    const filtroItems = document.querySelectorAll('.filtro-item');
    
    filtroItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const filtro = this.getAttribute('data-filtro');
            
            // Atualizar filtro ativo
            updateActiveFiltro(filtro);
            
            // Filtrar produtos
            filtrarProdutos(filtro);
            
            // Adicionar efeito de loading (removido para evitar conflitos com display: none)
            /*
            const produtos = document.querySelectorAll(\".produto-card\");
            produtos.forEach((produto, index) => {
                if (produto.classList.contains(\"filtro-visible\")) {
                    setTimeout(() => {
                        produto.style.animation = \"fadeInUp 0.6s ease forwards\";
                    }, index * 100);
                }
            });
            */
            
            console.log(`Filtro aplicado: ${filtro}`);
        });
    });
}

// Função para contar produtos por categoria
function contarProdutosPorCategoria() {
    const categorias = ['todos', 'solteiro', 'casal', 'queen', 'king'];
    const contadores = {};
    
    categorias.forEach(categoria => {
        if (categoria === 'todos') {
            contadores[categoria] = document.querySelectorAll('.produto-card').length;
        } else {
            contadores[categoria] = document.querySelectorAll(`[data-categoria="${categoria}"]`).length;
        }
    });
    
    return contadores;
}

// Função para adicionar contadores aos filtros (opcional)
function adicionarContadoresFiltros() {
    const contadores = contarProdutosPorCategoria();
    const filtroItems = document.querySelectorAll('.filtro-item');
    
    filtroItems.forEach(item => {
        const filtro = item.getAttribute('data-filtro');
        const contador = contadores[filtro] || 0;
        
        // Adicionar contador ao texto (opcional - descomente se desejar)
        // item.innerHTML += ` <span style="opacity: 0.7; font-size: 0.8em;">(${contador})</span>`;
    });
}

// Função para animação de entrada dos produtos (REMOVIDA PARA EVITAR CONFLITOS COM FILTROS)
/*
function animarEntradaProdutos() {
    const produtos = document.querySelectorAll(\".produto-card\");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = \"1\";
                    entry.target.style.transform = \"translateY(0)\";
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: \"0px 0px -50px 0px\"
    });
    
    produtos.forEach(produto => {
        produto.style.opacity = \"0\";
        produto.style.transform = \"translateY(40px)\";
        produto.style.transition = \"opacity 0.6s ease, transform 0.6s ease\";
        observer.observe(produto);
    });
}
*/

// Função para salvar filtro ativo no localStorage
function salvarFiltroAtivo(filtro) {
    localStorage.setItem('filtroColchoesAtivo', filtro);
}

// Função para carregar filtro ativo do localStorage
function carregarFiltroAtivo() {
    const filtroSalvo = localStorage.getItem('filtroColchoesAtivo');
    if (filtroSalvo) {
        updateActiveFiltro(filtroSalvo);
        filtrarProdutos(filtroSalvo);
    }
}

// Função para resetar filtros
function resetarFiltros() {
    updateActiveFiltro('todos');
    filtrarProdutos('todos');
    localStorage.removeItem('filtroColchoesAtivo');
}

// Atualizar a função de inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Capital Colchões Landing Page...');
    
    // Funcionalidades existentes
    setupNavigation();
    animateOnScroll();
    addLoadingCSS();
    addLoadingToWhatsAppButtons();
    addLoadingToDownloadButtons();
    addImageHoverEffect();
    lazyLoadImages();
    addMicroInteractions();
    optimizePerformance();
    
    // Novas funcionalidades de filtros
    setupFiltrosColchoes();
    adicionarContadoresFiltros();
    // animarEntradaProdutos(); // Removido para evitar conflitos com display: none
    
    // Inicialmente, exibe todos os produtos
    filtrarProdutos("todos");
    updateActiveFiltro("todos");
    
    // Detectar seção inicial
    setTimeout(detectVisibleSection, 100);
    
    console.log('✅ Capital Colchões - Landing Page com Filtros carregada com sucesso!');
    console.log('📊 Produtos por categoria:', contarProdutosPorCategoria());
    
    // Teste inicial dos filtros
    setTimeout(() => {
        console.log('🧪 Testando filtros...');
        const produtos = document.querySelectorAll('.produto-card');
        console.log(`   Total de produtos: ${produtos.length}`);
        
        produtos.forEach((produto, index) => {
            const categoria = produto.getAttribute('data-categoria');
            const nome = produto.querySelector('.produto-nome')?.textContent || 'Sem nome';
            console.log(`   ${index + 1}. ${nome} - Categoria: ${categoria || 'SEM CATEGORIA'}`);
        });
    }, 500);
});

