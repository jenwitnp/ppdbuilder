$(document).ready(function() {
    // Dark Mode Toggle
    const $html = $('html');
    const $themeToggle = $('#theme-toggle');
    const $themeIcon = $('#theme-icon');
    
    // Check local storage
    if (localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        $html.addClass('dark');
        $themeIcon.removeClass('fa-moon').addClass('fa-sun');
    } else {
        $html.removeClass('dark');
        $themeIcon.removeClass('fa-sun').addClass('fa-moon');
    }

    $themeToggle.on('click', function() {
        $html.toggleClass('dark');
        if ($html.hasClass('dark')) {
            localStorage.setItem('theme', 'dark');
            $themeIcon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            $themeIcon.removeClass('fa-sun').addClass('fa-moon');
        }
    });

    // Mobile Menu Toggle
    const $mobileMenuBtn = $('#mobile-menu-btn');
    const $mobileMenu = $('#mobile-menu');

    $mobileMenuBtn.on('click', function() {
        $mobileMenu.toggleClass('hidden');
    });

    // Close mobile menu on link click
    $('.mobile-nav-link').on('click', function() {
        $mobileMenu.addClass('hidden');
    });

    // Smooth Scrolling for Anchor Links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80 // Adjust for header height
            }, 800);
        }
    });

    // Navbar scroll effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('header').addClass('shadow-md');
        } else {
            $('header').removeClass('shadow-md');
        }
    });
});
