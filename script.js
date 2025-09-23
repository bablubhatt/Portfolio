// Wait for DOM to load before running
document.addEventListener('DOMContentLoaded', () => {
  // Dark Mode Toggle Function
  function toggleMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark');
    
    // Update button text dynamically
    const toggleBtn = document.querySelector('.toggle-btn');
    if (toggleBtn) {
      toggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }
    
    // Persist preference in localStorage
    localStorage.setItem('darkMode', isDark);
  }

  // Load saved dark mode preference on page load
  const savedDarkMode = localStorage.getItem('darkMode');
  const toggleBtn = document.querySelector('.toggle-btn');
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark');
    if (toggleBtn) {
      toggleBtn.textContent = 'Light Mode';
    }
  }

  // Event listener for toggle button (remove onclick from HTML if any)
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMode);
  }

  // Respect user's motion preferences (accessibility)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skill Bar Animation (using Intersection Observer for efficiency)
  const skillBars = document.querySelectorAll('.skill-fill');
  if (skillBars.length > 0 && !prefersReducedMotion) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const bar = entry.target;
        if (entry.isIntersecting && !bar.classList.contains('animated')) {
          bar.style.width = bar.dataset.width; // Modern dataset access
          bar.classList.add('animated'); // Prevent re-animation
        }
      });
    }, {
      threshold: 0.5, // Trigger when 50% of bar is visible
      rootMargin: '0px 0px -100px 0px' // Trigger 100px before viewport bottom
    });

    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  // Section Animations (fade-in once)
  const sections = document.querySelectorAll('section');
  if (sections.length > 0 && !prefersReducedMotion) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          // Keep 'show' class - no removal for smooth UX (no flicker on scroll up)
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% visible
      rootMargin: '0px 0px -50px 0px' // Slight early trigger
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Projects Animation with Staggered Delay (one-time only)
  const projects = document.querySelectorAll('.project');
  if (projects.length > 0 && !prefersReducedMotion) {
    let projectAnimated = new Set(); // Track animated projects
    const projectObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        const project = entry.target;
        const projectKey = project.id || `project-${index}`; // Unique key
        
        if (entry.isIntersecting && !projectAnimated.has(projectKey)) {
          // Staggered delay based on DOM order
          const delay = index * 250; // 250ms per project for smooth stagger
          setTimeout(() => {
            project.classList.add('show');
          }, delay);
          projectAnimated.add(projectKey); // Mark as animated
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Auto-assign IDs if missing for reliable tracking
    projects.forEach((project, index) => {
      if (!project.id) {
        project.id = `project-${index}`;
      }
      projectObserver.observe(project);
    });
  }

  // Initial animations for elements already in view (e.g., on short pages or slow load)
  if (!prefersReducedMotion) {
    // Skills
    skillBars.forEach((bar, index) => {
      if (bar.getBoundingClientRect().top < window.innerHeight && !bar.classList.contains('animated')) {
        setTimeout(() => {
          bar.style.width = bar.dataset.width;
          bar.classList.add('animated');
        }, index * 100); // Slight stagger for initial load
      }
    });

    // Sections
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight) {
        section.classList.add('show');
      }
    });

    // Projects
    projects.forEach((project, index) => {
      if (project.getBoundingClientRect().top < window.innerHeight) {
        setTimeout(() => {
          project.classList.add('show');
        }, index * 250);
      }
    });
  }

  // Optional: Smooth scrolling for anchor links (already in CSS, but JS fallback for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Console log for debugging (remove in production)
  console.log('Portfolio JS loaded successfully! 🚀');
});
