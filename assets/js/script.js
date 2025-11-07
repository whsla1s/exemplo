document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Lógica do Pop-up de Votação (Modal) ---
    // (Mantido igual ao código anterior - apenas aplicado na página index.html)
    const votingModal = document.getElementById('voting-modal');
    if (votingModal) { // Garante que o código só rode se o modal existir (i.e., na index.html)
        const closeButton = document.querySelector('.close-button');
        const portfolioName = document.getElementById('portfolio-name');
        const portfolioIdInput = document.getElementById('portfolio-id');
        const votingForm = document.getElementById('voting-form');
        const votingMessage = document.getElementById('voting-message');
        const voteButtons = document.querySelectorAll('.btn-vote');
        const ratingSections = document.querySelectorAll('.rating-section');
    
        // Função para abrir o modal
        voteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                
                portfolioName.textContent = name;
                portfolioIdInput.value = id;
                votingMessage.style.display = 'none';
                resetVotingForm();
                votingModal.style.display = 'block';
            });
        });
    
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

    // --- 2. Lógica do Modo Noturno (Persistência Corrigida) ---
    
    const toggleThemeButton = document.getElementById('toggle-theme');
    const body = document.body;
    
    // Função para aplicar o tema
    function applyTheme(theme) {
        if (!toggleThemeButton) return; // Se o botão não existir, para a função

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

    // 2.1. APLICAÇÃO INICIAL: Lê a preferência salva no LocalStorage e aplica imediatamente
    const currentTheme = localStorage.getItem('theme');
    
    // Se houver um tema salvo, usa ele. Se não, usa 'light' como padrão.
    applyTheme(currentTheme || 'light');


    // 2.2. LISTENER DO BOTÃO: Altera e salva a nova preferência
    if (toggleThemeButton) {
        toggleThemeButton.addEventListener('click', () => {
            const isDarkMode = body.classList.contains('dark-mode');
            
            // O tema atual é o que está aplicado *antes* do toggle
            const newTheme = isDarkMode ? 'light' : 'dark'; 

            // Aplica o novo tema e salva
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});