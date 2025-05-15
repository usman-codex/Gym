document.addEventListener('DOMContentLoaded', function () {

    // 0. Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.classList.add('hidden');
            // Optional: Remove preloader from DOM after transition
            setTimeout(() => {
                if (preloader.parentNode) {
                    // preloader.parentNode.removeChild(preloader); // Uncomment to remove
                }
            }, 600); // Match transition duration
        });
    }

    // 1. Header Search Toggle
    const searchIcon = document.getElementById('search-icon');
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.querySelector('.search-container'); // For click outside

    if (searchIcon && searchInput && searchContainer) {
        searchIcon.addEventListener('click', function (event) {
            event.stopPropagation();
            searchInput.classList.toggle('active');
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            }
        });

        document.addEventListener('click', function(event) {
            if (searchInput.classList.contains('active') && !searchContainer.contains(event.target) && event.target !== searchIcon) {
                searchInput.classList.remove('active');
            }
        });
    }

    // 2. Sticky Header
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        const stickyThreshold = 80; // Pixels to scroll before header becomes sticky
        window.addEventListener('scroll', function() {
            if (window.scrollY > stickyThreshold) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        });
    }

    // 3. Hero Slider (Swiper.js)
    if (document.querySelector('.hero-slider')) {
        const heroSwiper = new Swiper('.hero-slider', {
            loop: true,
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            autoplay: {
                delay: 5500, // Slightly increased delay
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            on: {
                init: function () {
                    // Animate first slide elements on init
                    animateSwiperElements(this.slides[this.activeIndex]);
                },
                slideChangeTransitionStart: function () {
                    // Animate elements of the active slide
                    animateSwiperElements(this.slides[this.activeIndex]);
                }
            }
        });
    }
    
    function animateSwiperElements(activeSlide) {
        const animatedElements = activeSlide.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            el.style.animation = 'none'; // Reset animation
            //offsetHeight triggers reflow, useful for restarting animation
            void el.offsetHeight; 
            const animationName = el.dataset.animation || 'fadeInUp';
            const animationDelay = el.dataset.animationDelay || '0s';
            el.style.animation = `${animationName} 1s ${animationDelay} forwards ease-out`;
        });
    }


    // 4. Testimonial Slider (Swiper.js)
    if (document.querySelector('.testimonial-slider')) {
        const testimonialSwiper = new Swiper('.testimonial-slider', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.testimonial-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 1, // Can be 2 if design allows
                },
                992: {
                    slidesPerView: 1, // Can be 2 or 3 if design allows
                }
            }
        });
    }

    // 5. Countdown Timer
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const targetDateStr = countdownElement.dataset.targetDate || 
                              new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000 + 56 * 60 * 1000 + 50 * 1000).toISOString();
        const countDownDate = new Date(targetDateStr).getTime();

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if(daysEl && hoursEl && minutesEl && secondsEl) {
            const updateCountdown = setInterval(function () {
                const now = new Date().getTime();
                const distance = countDownDate - now;

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                daysEl.innerText = String(days).padStart(2, '0');
                hoursEl.innerText = String(hours).padStart(2, '0');
                minutesEl.innerText = String(minutes).padStart(2, '0');
                secondsEl.innerText = String(seconds).padStart(2, '0');

                if (distance < 0) {
                    clearInterval(updateCountdown);
                    daysEl.innerText = "00";
                    hoursEl.innerText = "00";
                    minutesEl.innerText = "00";
                    secondsEl.innerText = "00";
                    // Optionally display "EXPIRED" or similar
                    // countdownElement.innerHTML = "<div class='text-center h4'>EVENT EXPIRED</div>";
                }
            }, 1000);
        }
    }

    // 6. Counter Animation on Scroll
    const counters = document.querySelectorAll('.counter-value');
    const counterAnimationSpeed = 20; // Milliseconds per step, lower is faster

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let currentCount = 0;
        const increment = Math.max(1, Math.floor(target / (1000 / counterAnimationSpeed / (target > 100 ? 2 : 1) ) ) ); // Dynamic increment

        const updateCounter = () => {
            currentCount += increment;
            if (currentCount < target) {
                counter.innerText = currentCount;
                setTimeout(updateCounter, counterAnimationSpeed);
            } else {
                counter.innerText = target; // Ensure final value is exact
            }
        };
        updateCounter();
        counter.classList.add('animated'); // Prevent re-animating
    };

    const counterObserverOptions = {
        root: null,
        threshold: 0.5 // Trigger when 50% of the element is visible
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target.classList.contains('counter-value') ? entry.target : entry.target.querySelector('.counter-value');
                if (counterElement && !counterElement.classList.contains('animated')) {
                    animateCounter(counterElement);
                    // observer.unobserve(entry.target); // Stop observing after animation
                }
            }
        });
    }, counterObserverOptions);

    const counterItems = document.querySelectorAll('.counter-item'); // Observe parent items
    if (counterItems.length > 0) {
        counterItems.forEach(item => counterObserver.observe(item));
    } else { // Fallback if only .counter-value exists without .counter-item parent
        counters.forEach(counter => {
            if (!counter.closest('.counter-item')) { // Only observe if not part of a .counter-item
                counterObserver.observe(counter);
            }
        });
    }

    // 7. Scroll-triggered Animations for Sections and Elements
    const animatedElements = document.querySelectorAll('.animate-section, .animate-on-scroll');
    const animationObserverOptions = {
        root: null,
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before fully in viewport
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const animationName = el.dataset.animation || 'fadeInUp'; // Default animation
                const animationDelay = el.dataset.animationDelay || '0s';
                const animationDuration = el.dataset.animationDuration || '0.8s';

                el.style.visibility = 'visible';
                el.style.animationName = animationName;
                el.style.animationDelay = animationDelay;
                el.style.animationDuration = animationDuration;
                el.classList.add('animated-visible'); // Add class to confirm it's animated

                observer.unobserve(el); // Animate only once
            }
        });
    }, animationObserverOptions);

    animatedElements.forEach(el => {
        // Prepare elements for animation (initially hidden)
        // Make sure your CSS has .animate-section or .animate-on-scroll set to opacity: 0 and visibility: hidden
        animationObserver.observe(el);
    });

    // 8. Bootstrap Dropdown on Hover for Desktop (Optional Enhancement)
    // Bootstrap 5 default is click. This adds hover functionality for larger screens.
    if (window.innerWidth >= 992) { // lg breakpoint
        document.querySelectorAll('.navbar .nav-item.dropdown').forEach(function(everyitem){
            everyitem.addEventListener('mouseover', function(e){
                let el_link = this.querySelector('a[data-bs-toggle]');
                if(el_link != null){
                    let nextEl = el_link.nextElementSibling;
                    el_link.classList.add('show');
                    if(nextEl != null && nextEl.classList.contains('dropdown-menu')) {
                        nextEl.classList.add('show');
                    }
                }
            });
            everyitem.addEventListener('mouseleave', function(e){
                let el_link = this.querySelector('a[data-bs-toggle]');
                if(el_link != null){
                    let nextEl = el_link.nextElementSibling;
                    el_link.classList.remove('show');
                     if(nextEl != null && nextEl.classList.contains('dropdown-menu')) {
                        nextEl.classList.remove('show');
                    }
                }
            });
        });
    }


}); // End DOMContentLoaded