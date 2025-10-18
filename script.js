document.addEventListener('DOMContentLoaded', function() {
    // Language Switching Functionality
    const languageButtons = document.querySelectorAll('.language-btn');
    let currentLang = 'en'; // Default language

    // Function to switch language
    function switchLanguage(lang) {
        currentLang = lang;
        
        // Update active button
        languageButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update HTML lang attribute and direction
        document.documentElement.setAttribute('lang', lang);
        if (lang === 'ar' || lang === 'he') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.setAttribute('dir', 'ltr');
        }
        
        // Translate all elements with data-key attribute
        const translatableElements = document.querySelectorAll('[data-key]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.setAttribute('placeholder', translations[lang][key]);
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Save language preference
        localStorage.setItem('preferred-language', lang);
    }

    // Add click event listeners to language buttons
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang) {
        switchLanguage(savedLang);
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
        });
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const achievementImages = document.querySelectorAll('.achievement-image');

    let currentImageIndex = 0;
    const totalImages = achievementImages.length;

    // Open lightbox when clicking on achievement images
    achievementImages.forEach((image, index) => {
        image.addEventListener('click', function() {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });

    function updateLightboxImage() {
        const imageSrc = achievementImages[currentImageIndex].getAttribute('src');
        lightboxImage.setAttribute('src', imageSrc);
        lightboxImage.setAttribute('alt', achievementImages[currentImageIndex].getAttribute('alt'));
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateLightboxImage();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Survey Modal Functionality
    const surveyModal = document.getElementById('surveyModal');
    const startSurveyBtns = document.querySelectorAll('#startSurveyBtn, #startSurveyBtn2, #startSurveyBtn3');
    const closeModal = document.getElementById('closeModal');
    const closeSurveyModal = document.getElementById('closeSurveyModal');

    // Survey navigation variables
    const steps = document.querySelectorAll('.survey-step');
    const progressBar = document.getElementById('progressBar');
    const stepIndicators = [
        document.getElementById('step1Indicator'),
        document.getElementById('step2Indicator'),
        document.getElementById('step3Indicator'),
        document.getElementById('step4Indicator')
    ];

    let currentStep = 0;

    // Open survey modal
    startSurveyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            surveyModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            resetSurvey();
        });
    });

    // Close survey modal
    closeModal.addEventListener('click', closeSurvey);
    closeSurveyModal.addEventListener('click', closeSurvey);

    function closeSurvey() {
        surveyModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function resetSurvey() {
        currentStep = 0;
        updateSurveyProgress();
        
        // Reset all option selections
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Reset form
        document.getElementById('surveyContactForm').reset();
    }

    function updateSurveyProgress() {
        // Update step visibility
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });
        
        // Update progress bar
        const progress = (currentStep / (steps.length - 1)) * 100;
        progressBar.style.width = progress + '%';
        
        // Update step indicators
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index <= currentStep);
        });
    }

    // Survey navigation
    document.getElementById('nextStep1').addEventListener('click', function() {
        if (validateStep(1)) {
            currentStep = 1;
            updateSurveyProgress();
        }
    });

    document.getElementById('prevStep2').addEventListener('click', function() {
        currentStep = 0;
        updateSurveyProgress();
    });

    document.getElementById('nextStep2').addEventListener('click', function() {
        if (validateStep(2)) {
            currentStep = 2;
            updateSurveyProgress();
        }
    });

    document.getElementById('prevStep3').addEventListener('click', function() {
        currentStep = 1;
        updateSurveyProgress();
    });

    document.getElementById('nextStep3').addEventListener('click', function() {
        if (validateStep(3)) {
            currentStep = 3;
            updateSurveyProgress();
        }
    });

    document.getElementById('prevStep4').addEventListener('click', function() {
        currentStep = 2;
        updateSurveyProgress();
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const phone = document.getElementById('phone').value;
            const idNumber = document.getElementById('idNumber').value;
            const area = document.getElementById('area').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!firstName || !lastName || !phone || !idNumber || !area) {
                alert(getTranslation('form.requiredFields'));
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = getTranslation('form.sending');
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://mnjmoney-be.onrender.com/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: `${firstName} ${lastName}`,
                        email: `contact-${phone}@mnjmoney.com`,
                        message: `Phone: ${phone}, ID: ${idNumber}, Area: ${area}, Message: ${message || 'No message provided'}`
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert(getTranslation('form.success'));
                    contactForm.reset();
                } else {
                    alert(result.detail || getTranslation('form.error'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert(getTranslation('form.networkError'));
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Survey Form Submission
    document.getElementById('submitSurvey').addEventListener('click', async function() {
        if (validateStep(4)) {
            const submitBtn = this;
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = getTranslation('form.sending');
            submitBtn.disabled = true;

            try {
                // Get survey data
                const fullNameInput = document.querySelector('#surveyContactForm input[placeholder*="Name"], #surveyContactForm input[placeholder*="اسم"], #surveyContactForm input[placeholder*="שם"]');
                const phoneInput = document.querySelector('#surveyContactForm input[placeholder*="Phone"], #surveyContactForm input[placeholder*="هاتف"], #surveyContactForm input[placeholder*="טלפון"]');
                const emailInput = document.querySelector('#surveyContactForm input[placeholder*="Email"], #surveyContactForm input[placeholder*="بريد"], #surveyContactForm input[placeholder*="אימייל"]');
                
                const fullName = fullNameInput?.value || '';
                const phone = phoneInput?.value || '';
                const email = emailInput?.value || '';
                
                // Get selected options
                const employmentStatus = document.querySelector('#step1 .option-btn.selected')?.dataset.value || 'Not specified';
                const employmentType = document.querySelector('#step2 .option-btn.selected')?.dataset.value || 'Not specified';
                const servicesInterest = document.querySelector('#step4 .option-btn.selected')?.dataset.value || 'Not specified';
                const preferredLanguage = document.querySelectorAll('#step4 .option-btn.selected')[1]?.dataset.value || 'Not specified';

                // Send to backend
                const response = await fetch('https://mnjmoney-be.onrender.com/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: fullName || 'Survey User',
                        email: email || `survey-${phone}@mnjmoney.com`,
                        message: `SURVEY SUBMISSION - Name: ${fullName}, Phone: ${phone}, Email: ${email}, Employment: ${employmentStatus}, Type: ${employmentType}, Service Interest: ${servicesInterest}, Language: ${preferredLanguage}`
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Show thank you step
                    document.getElementById('step4').style.display = 'none';
                    document.getElementById('thankYouStep').style.display = 'block';
                } else {
                    alert(result.detail || getTranslation('form.error'));
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert(getTranslation('form.networkError'));
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });

    function validateStep(step) {
        // Add validation logic for each step
        // For now, just return true
        return true;
    }

    // Option button selection
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.survey-question');
            parent.querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });

    // Helper function to get translation
    function getTranslation(key) {
        return translations[currentLang]?.[key] || translations.en[key] || key;
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
    });
    
    // Video Section Functionality
    function initVideoSection() {
        const videoCards = document.querySelectorAll('.video-card');
        const videos = document.querySelectorAll('.customer-video');
        const playButtons = document.querySelectorAll('.play-btn');
        const videoWrappers = document.querySelectorAll('.video-wrapper');

        // Animate video cards on scroll
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, parseInt(entry.target.dataset.delay || 0));
                }
            });
        }, observerOptions);

        videoCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            observer.observe(card);
        });

        // Play button functionality
        playButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const video = videos[index];
                const wrapper = videoWrappers[index];
                
                if (video.paused) {
                    video.play().catch(error => {
                        console.error('Error playing video:', error);
                        // Fallback: show video controls if autoplay fails
                        video.controls = true;
                    });
                    wrapper.classList.add('playing');
                    this.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    wrapper.classList.remove('playing');
                    this.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        });

        // Video event listeners
        videos.forEach((video, index) => {
            const wrapper = videoWrappers[index];
            const playBtn = playButtons[index];

            video.addEventListener('play', function() {
                wrapper.classList.add('playing');
                if (playBtn) {
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }
            });

            video.addEventListener('pause', function() {
                wrapper.classList.remove('playing');
                if (playBtn) {
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });

            video.addEventListener('ended', function() {
                wrapper.classList.remove('playing');
                if (playBtn) {
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });

            // Handle video loading errors
            video.addEventListener('error', function() {
                console.error('Error loading video:', video.src);
                // Show a fallback message
                const fallbackMessage = document.createElement('div');
                fallbackMessage.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 20px;
                    border-radius: 10px;
                `;
                fallbackMessage.innerHTML = `
                    <div>
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                        <p>Video not available</p>
                        <small>Please check if video files (video1.mp4, video2.mp4) exist in your project folder</small>
                    </div>
                `;
                wrapper.appendChild(fallbackMessage);
            });
        });

        // Click on video wrapper to play/pause
        videoWrappers.forEach((wrapper, index) => {
            wrapper.addEventListener('click', function(e) {
                if (e.target.classList.contains('play-btn') || e.target.closest('.play-btn')) {
                    return; // Let the play button handle it
                }
                const video = videos[index];
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        });
    }

    // Initialize video section
    initVideoSection();
});