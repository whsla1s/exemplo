document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica do Modo Noturno (Dark/Light Mode)
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;
    const modeIcon = modeToggle.querySelector('i');

    // Verifica a preferência do usuário ou o estado salvo
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'dark') {
        body.classList.add('dark-mode');
        modeIcon.classList.remove('fa-moon');
        modeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-mode');
        modeIcon.classList.remove('fa-sun');
        modeIcon.classList.add('fa-moon');
    }

    // Listener para o botão de alternância
    modeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('themeMode', 'dark');
            modeIcon.classList.remove('fa-moon');
            modeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('themeMode', 'light');
            modeIcon.classList.remove('fa-sun');
            modeIcon.classList.add('fa-moon');
        }
    });

    // 2. Lógica do Pop-up de Votação (Modal)
    const modal = document.getElementById('voting-modal');
    const closeBtn = document.querySelector('.close-btn');
    const voteButtons = document.querySelectorAll('.btn-vote');
    const portfolioIdDisplay = document.getElementById('portfolio-id');
    const votingForm = document.getElementById('voting-form');
    const starContainers = document.querySelectorAll('.stars');
    
    let currentPortfolioId = null;

    // Abrir o Modal
    voteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentPortfolioId = e.target.closest('.btn-vote').dataset.portfolioId;
            portfolioIdDisplay.textContent = currentPortfolioId;
            modal.style.display = 'flex'; // Usar flex para centralizar
            resetStars(); // Limpa as estrelas antes de abrir
        });
    });

    // Fechar o Modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar o Modal clicando fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Função para limpar as estrelas e os valores ocultos
    function resetStars() {
        starContainers.forEach(container => {
            const stars = container.querySelectorAll('.star-icon');
            stars.forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });
            container.querySelector('input[type="hidden"]').value = 0;
        });
    }

    // Lógica de Classificação por Estrelas
    starContainers.forEach(container => {
        const category = container.dataset.category;
        const stars = container.querySelectorAll('.star-icon');
        const hiddenInput = container.querySelector(`input[name="${category}_score"]`);

        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);

            // Efeito de hover (preencher até a estrela atual)
            star.addEventListener('mouseover', () => {
                stars.forEach(s => {
                    if (parseInt(s.dataset.value) <= starValue) {
                        s.classList.add('fas', 'hover');
                        s.classList.remove('far');
                    } else {
                        s.classList.remove('fas', 'hover');
                        s.classList.add('far');
                    }
                });
            });

            // Reverter o hover, mantendo a seleção atual
            container.addEventListener('mouseout', () => {
                stars.forEach(s => {
                    s.classList.remove('hover');
                    if (parseInt(s.dataset.value) <= parseInt(hiddenInput.value)) {
                        s.classList.add('fas');
                        s.classList.remove('far');
                    } else {
                        s.classList.add('far');
                        s.classList.remove('fas');
                    }
                });
            });

            // Clique para registrar a votação da estrela
            star.addEventListener('click', () => {
                hiddenInput.value = starValue;
                // Preenche as estrelas até o valor clicado permanentemente
                stars.forEach(s => {
                    if (parseInt(s.dataset.value) <= starValue) {
                        s.classList.add('fas');
                        s.classList.remove('far');
                    } else {
                        s.classList.add('far');
                        s.classList.remove('fas');
                    }
                });
                // Garante que o hover é removido após o clique
                container.dispatchEvent(new Event('mouseout')); 
            });
        });
    });

    // Lógica de Envio do Formulário (Apenas demonstração)
    votingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const designScore = parseInt(votingForm.elements.design_score.value);
        const usabilityScore = parseInt(votingForm.elements.usability_score.value);
        const creativityScore = parseInt(votingForm.elements.creativity_score.value);

        if (designScore === 0 || usabilityScore === 0 || creativityScore === 0) {
            alert('Por favor, avalie todas as 3 categorias com pelo menos 1 estrela.');
            return;
        }

        const voto = {
            portfolioId: currentPortfolioId,
            design: designScore,
            usabilidade: usabilityScore,
            criatividade: creativityScore,
            timestamp: new Date().toISOString()
        };

        console.log('Voto registrado:', voto);
        alert(`Voto registrado com sucesso para o Portfólio #${currentPortfolioId}! (Ver console para detalhes do voto)`);
        
        // Simular o fechamento após o envio
        modal.style.display = 'none';
        resetStars(); // Limpar após o envio
    });
});