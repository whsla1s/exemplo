document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Lógica do Modo Noturno (Persistência Corrigida) ---
    const toggleThemeButton = document.getElementById('toggle-theme');
    const body = document.body;
    
    // Função para aplicar o tema
    function applyTheme(theme) {
        if (!toggleThemeButton) return; 

        const icon = toggleThemeButton.querySelector('i');
        
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            body.classList.remove('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // APLICAÇÃO INICIAL: Lê a preferência salva no LocalStorage e aplica imediatamente
    const currentTheme = localStorage.getItem('theme');
    applyTheme(currentTheme || 'light');


    // LISTENER DO BOTÃO: Altera e salva a nova preferência
    if (toggleThemeButton) {
        toggleThemeButton.addEventListener('click', () => {
            const isDarkMode = body.classList.contains('dark-mode');
            const newTheme = isDarkMode ? 'light' : 'dark'; 

            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- 2. Lógica do Pop-up de Votação (Modal) ---
    const votingModal = document.getElementById('voting-modal');
    
    if (votingModal) { // Roda apenas na index.html
        const closeButton = document.querySelector('.close-button');
        const portfolioName = document.getElementById('portfolio-name');
        const portfolioIdInput = document.getElementById('portfolio-id');
        const votingForm = document.getElementById('voting-form');
        const votingMessage = document.getElementById('voting-message');
        
        // Esta variável será populada após a injeção dos cards
        let voteButtons = document.querySelectorAll('.btn-vote'); 
        const ratingSections = document.querySelectorAll('.rating-section');
    
        // Função para abrir o modal
        function setupVoteListeners() {
            voteButtons = document.querySelectorAll('.btn-vote');
            voteButtons.forEach(button => {
                // Remove listeners anteriores para evitar duplicidade após a injeção
                button.removeEventListener('click', handleVoteClick); 
                button.addEventListener('click', handleVoteClick);
            });
        }
        
        function handleVoteClick() {
            const button = this; // 'this' é o botão clicado
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            
            portfolioName.textContent = name;
            portfolioIdInput.value = id;
            votingMessage.style.display = 'none';
            resetVotingForm();
            votingModal.style.display = 'block';
        }

        // Função para fechar o modal
        closeButton.addEventListener('click', () => {
            votingModal.style.display = 'none';
        });
    
        // Fechar o modal clicando fora dele
        window.addEventListener('click', (event) => {
            if (event.target === votingModal) {
                votingModal.style.display = 'none';
            }
        });
    
        // Lógica de Rating (Estrelas)
        ratingSections.forEach(section => {
            const starsContainer = section.querySelector('.stars');
            const stars = starsContainer.querySelectorAll('i');
            const hiddenInput = section.querySelector('input[type="hidden"]');
    
            // ... (Lógica de rating mantida) ...
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const rating = index + 1;
                    hiddenInput.value = rating;
                    updateStars(stars, rating);
                });
    
                star.addEventListener('mouseover', () => {
                    updateStars(stars, index + 1);
                });
    
                starsContainer.addEventListener('mouseleave', () => {
                    const currentRating = parseInt(hiddenInput.value);
                    updateStars(stars, currentRating);
                });
            });
            // ...
        });
    
        // Função auxiliar para atualizar o preenchimento das estrelas
        function updateStars(stars, rating) {
            stars.forEach((star, i) => {
                if (i < rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        }
    
        // Função para resetar as estrelas e inputs para 0
        function resetVotingForm() {
            ratingSections.forEach(section => {
                const starsContainer = section.querySelector('.stars');
                const stars = starsContainer.querySelectorAll('i');
                const hiddenInput = section.querySelector('input[type="hidden"]');
                
                hiddenInput.value = '0';
                updateStars(stars, 0);
            });
        }
    
        // Simulação do envio do formulário de votação
        votingForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const inovacao = votingForm.querySelector('input[name="inovacao_rating"]').value;
            const codigo = votingForm.querySelector('input[name="codigo_rating"]').value;
            const usabilidade = votingForm.querySelector('input[name="usabilidade_rating"]').value;
    
            if (inovacao === '0' || codigo === '0' || usabilidade === '0') {
                alert('Por favor, avalie todas as 3 categorias antes de enviar o voto.');
                return;
            }
    
            votingMessage.style.display = 'block';
    
            setTimeout(() => {
                votingModal.style.display = 'none';
            }, 1500); 
        });
    }


    // --- 3. Lógica de Paginação e Injeção de Cards (Roda apenas na index.html) ---
    const portfolioList = document.getElementById('portfolio-list');

    if (portfolioList) {
        
        // 3.1. INJEÇÃO DOS CARDS ADICIONAIS (para totalizar 67)
        for (let i = 4; i <= 67; i++) {
            const card = document.createElement('div');
            card.classList.add('portfolio-card');
            card.innerHTML = `
                <div class="card-image"><img src="assets/img/capa${(i % 3) + 1}.jpg" alt="Capa do Portfólio ${i}"></div>
                <div class="card-info">
                    <h4>Projeto Aleatório #${i}</h4>
                    <p>Autor: **Dev #${i}**</p>
                </div>
                <div class="card-actions">
                    <a href="#" target="_blank" class="btn btn-secondary">Ver Portfólio</a>
                    <button class="btn btn-primary btn-vote" data-id="${i}" data-name="Projeto Aleatório #${i}">Registrar Voto</button>
                </div>
            `;
            portfolioList.appendChild(card);
        }
        
        // Se o modal de votação existe, reconfigura os listeners dos novos botões
        if (votingModal) {
            setupVoteListeners();
        }

        // 3.2. PAGINAÇÃO
        const cards = Array.from(portfolioList.querySelectorAll('.portfolio-card'));
        const cardsPerPage = 10;
        const totalCards = cards.length;
        const totalPages = Math.ceil(totalCards / cardsPerPage);
        let currentPage = 1;

        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const pageNumbersContainer = document.getElementById('page-numbers');

        // Função para exibir os cards da página atual
        function displayCards(page) {
            currentPage = page;
            const start = (page - 1) * cardsPerPage;
            const end = start + cardsPerPage;

            cards.forEach((card, index) => {
                card.style.display = (index >= start && index < end) ? 'block' : 'none';
            });

            updatePaginationControls();
        }

        // Função para atualizar os botões (prev/next) e os números
        function updatePaginationControls() {
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages;

            pageNumbersContainer.innerHTML = ''; 
            for (let i = 1; i <= totalPages; i++) {
                const pageNum = document.createElement('span');
                pageNum.classList.add('page-number');
                pageNum.textContent = i;
                if (i === currentPage) {
                    pageNum.classList.add('active');
                }
                pageNum.addEventListener('click', () => {
                    displayCards(i);
                });
                pageNumbersContainer.appendChild(pageNum);
            }
        }

        // Listeners para os botões Anterior e Próxima
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                displayCards(currentPage - 1);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                displayCards(currentPage + 1);
            }
        });

        // Chamada inicial para mostrar a primeira página
        displayCards(1);
    }

});