
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 120
    });
    
    // Mobile menu toggle
    document.getElementById('mobile-menu').addEventListener('click', function() {
      const navMenu = document.getElementById('nav-menu');
      navMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link

    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        document.getElementById('nav-menu').classList.remove('active');
        document.getElementById('mobile-menu').classList.remove('active');
      });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });