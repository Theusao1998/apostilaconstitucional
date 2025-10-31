document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    loadAllContent();
    setupScrollSpy();
    setupSmoothScrolling();
});

async function loadAllContent() {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) return;

    try {
        const chapterFiles = [
            'content/chapter_1.html',
            'content/chapter_2.html',
            'content/chapter_4.html'
        ];

        let fullContent = '';
        for (const file of chapterFiles) {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`Failed to load ${file}: ${response.statusText}`);
            }
            fullContent += await response.text();
        }
        contentContainer.innerHTML = fullContent;
        lucide.createIcons(); // Re-run lucide after adding new content
    } catch (error) {
        contentContainer.innerHTML = `<p class="text-red-500">Erro ao carregar o conteúdo da apostila. Tente recarregar a página.</p><p>${error.message}</p>`;
        console.error(error);
    }
}

function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a.nav-link:not(.inactive)');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                e.preventDefault();
                const targetElement = document.querySelector(this.hash);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navigation-menu .nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: "-30% 0px -70% 0px", threshold: 0 });

    sections.forEach(section => {
        observer.observe(section);
    });


    const lastSection = sections[sections.length -1];
    if(lastSection) {
        const lastSectionObserver = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                 navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        }, { threshold: 0.8 });
        lastSectionObserver.observe(lastSection);
    }
}
