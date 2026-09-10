// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    /* ===================================================
       1. ACESSIBILIDADE (FONTE E CONTRASTE)
    =================================================== */
    let currentFontSize = 16;

    const btnIncreaseFont = document.getElementById('btn-increase-font');
    const btnDecreaseFont = document.getElementById('btn-decrease-font');
    const btnToggleContrast = document.getElementById('btn-toggle-contrast');

    btnIncreaseFont.addEventListener('click', () => {
        let novaFonte = currentFontSize + 2;
        if (novaFonte >= 12 && novaFonte <= 24) {
            currentFontSize = novaFonte;
            document.documentElement.style.fontSize = `${currentFontSize}px`;
        }
    });

    btnDecreaseFont.addEventListener('click', () => {
        let novaFonte = currentFontSize - 2;
        if (novaFonte >= 12 && novaFonte <= 24) {
            currentFontSize = novaFonte;
            document.documentElement.style.fontSize = `${currentFontSize}px`;
        }
    });

    btnToggleContrast.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
    });

    /* ===================================================
       2. LÓGICA DO GERADOR DE SENHAS
    =================================================== */
    const passwordOutput = document.getElementById('password-output');
    const btnCopy = document.getElementById('btn-copy');
    const copyMessage = document.getElementById('copy-message');
    const btnGenerate = document.getElementById('btn-generate');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    
    const chkUppercase = document.getElementById('chk-uppercase');
    const chkLowercase = document.getElementById('chk-lowercase');
    const chkNumbers = document.getElementById('chk-numbers');
    const chkSymbols = document.getElementById('chk-symbols');
    
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
        generatePassword();
    });

    function generatePassword() {
        let allowedChars = '';
        if (chkUppercase.checked) allowedChars += charSets.uppercase;
        if (chkLowercase.checked) allowedChars += charSets.lowercase;
        if (chkNumbers.checked) allowedChars += charSets.numbers;
        if (chkSymbols.checked) allowedChars += charSets.symbols;

        if (!allowedChars) {
            passwordOutput.value = 'Selecione 1 opção';
            updateStrengthIndicator(0);
            return;
        }

        const length = parseInt(lengthSlider.value);
        let password = '';
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            password += allowedChars[randomValues[i] % allowedChars.length];
        }

        passwordOutput.value = password;
        evaluateStrength(password, length);
    }

    function evaluateStrength(password, length) {
        let score = 0;
        if (length >= 12) score++;
        if (length >= 16) score++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        updateStrengthIndicator(score);
    }

    function updateStrengthIndicator(score) {
        strengthBar.className = 'strength-bar-fill';
        if (score <= 2) {
            strengthBar.classList.add('strength-weak');
            strengthText.textContent = 'Fraca';
        } else if (score <= 4) {
            strengthBar.classList.add('strength-medium');
            strengthText.textContent = 'Média';
        } else {
            strengthBar.classList.add('strength-strong');
            strengthText.textContent = 'Ultra Forte';
        }
    }

    btnCopy.addEventListener('click', () => {
        if (!passwordOutput.value || passwordOutput.value === 'Selecione 1 opção') return;
        
        navigator.clipboard.writeText(passwordOutput.value).then(() => {
            copyMessage.classList.add('show');
            setTimeout(() => copyMessage.classList.remove('show'), 2000);
        });
    });

    [chkUppercase, chkLowercase, chkNumbers, chkSymbols].forEach(chk => {
        chk.addEventListener('change', generatePassword);
    });

    btnGenerate.addEventListener('click', generatePassword);

    // Gerar a primeira senha ao carregar
    generatePassword();

    /* ===================================================
       3. RENDERIZAÇÃO E LÓGICA DO CARROSSEL DE DEPOIMENTOS
    =================================================== */
    const testimonialsData = [
        {
            quote: "O CipherVault tornou a gestão de senhas no nosso departamento incrivelmente ágil e segura. A geração local traz total paz de espírito.",
            author: "Carlos Eduardo Silveira",
            role: "CTO em FinTech Shield"
        },
        {
            quote: "Recomendo a todos os meus clientes de consultoria. A entropia das senhas atende rigorosamente aos padrões da LGPD e ISO 27001.",
            author: "Mariana Alencar",
            role: "Especialista em Segurança da Informação"
        },
        {
            quote: "Interface intuitiva, sem ruídos e altamente acessível. Um exemplo de como a segurança digital deve ser entregue ao usuário.",
            author: "Roberto Mendes",
            role: "Engenheiro de Software Sênior"
        }
    ];

    const carouselTrack = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;

    function renderTestimonials() {
        carouselTrack.innerHTML = testimonialsData.map(item => `
            <div class="testimonial-card">
                <p>"${item.quote}"</p>
                <h4>${item.author}</h4>
                <span>${item.role}</span>
            </div>
        `).join('');
    }

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonialsData.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonialsData.length) % testimonialsData.length;
        updateCarousel();
    });

    renderTestimonials();

    /* ===================================================
       4. RENDERIZAÇÃO E LÓGICA DO ACORDEÃO (FAQ)
    =================================================== */
    const faqData = [
        {
            question: "Como o CipherVault garante que minhas senhas não são salvas?",
            answer: "As senhas são geradas via JavaScript diretamente na memória do seu navegador usando a API de Criptografia W3C (Web Crypto API). Nenhuma informação trafega para servidores."
        },
        {
            question: "O que torna uma senha realmente segura?",
            answer: "Uma senha segura deve ter um comprimento de pelo menos 16 caracteres e combinar letras maiúsculas, minúsculas, números e símbolos especiais de forma imprevisível."
        },
        {
            question: "Posso utilizar este gerador para conformidade com a LGPD?",
            answer: "Sim! A criação de credenciais fortes é um dos pilares de controle de acesso para garantir a segurança dos dados pessoais tratados por sua organização."
        }
    ];

    const faqAccordion = document.getElementById('faq-accordion');

    function renderFAQ() {
        faqAccordion.innerHTML = faqData.map((item, index) => `
            <div class="accordion-item ${index === 0 ? 'active' : ''}">
                <button class="accordion-header">
                    <span>${item.question}</span>
                    <span class="icon">+</span>
                </button>
                <div class="accordion-body">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');

        const headers = faqAccordion.querySelectorAll('.accordion-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const isActive = item.classList.contains('active');
                
                // Fecha todos os itens
                faqAccordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
                
                // Se não estava ativo, ativa o atual
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    renderFAQ();
});