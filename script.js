if (typeof translations === 'undefined') {
    console.error('Translations not loaded! Make sure translations.js loads before script.js');
    // Create a fallback empty translations object to prevent errors
    var translations = {
        en: {},
        ar: {}, 
        he: {}
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // Set Arabic as default
    let currentLang = 'ar';
    document.documentElement.setAttribute('lang', 'ar');
    document.body.setAttribute('dir', 'rtl');

    // Language Switching Functionality
    const languageButtons = document.querySelectorAll('.language-btn');

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
        
        updateSurveyNavigationText();
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
    
    function updateSurveyNavigationText() {
        const nextButtons = document.querySelectorAll('.next-btn');
        const prevButtons = document.querySelectorAll('.prev-btn');
    
        nextButtons.forEach(btn => {
            btn.textContent = getTranslation('survey.next');
        });
    
        prevButtons.forEach(btn => {
            btn.textContent = getTranslation('survey.previous');
        });
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
        if (validateSurveyStep(1)) {
            currentStep = 1;
            updateSurveyProgress();
        }
    });

    document.querySelectorAll('.video-wrapper').forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const overlay = wrapper.querySelector('.video-overlay');

        // Handle overlay click (toggle play/pause)
        overlay.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                wrapper.classList.add('playing');
            } else {
                video.pause();
                wrapper.classList.remove('playing');
            }
        });

        // Handle video play/pause updates (sync overlay visibility)
        video.addEventListener('play', () => wrapper.classList.add('playing'));
        video.addEventListener('pause', () => wrapper.classList.remove('playing'));
    });

    document.getElementById('prevStep2').addEventListener('click', function() {
        currentStep = 0;
        updateSurveyProgress();
    });

    document.getElementById('nextStep2').addEventListener('click', function() {
        if (validateSurveyStep(2)) {
            currentStep = 2;
            updateSurveyProgress();
        }
    });

    document.getElementById('prevStep3').addEventListener('click', function() {
        currentStep = 1;
        updateSurveyProgress();
    });

    document.getElementById('nextStep3').addEventListener('click', function() {
        if (validateSurveyStep(3)) {
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
        if (validateSurveyStep(4)) {
            const submitBtn = this;
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = getTranslation('form.sending');
            submitBtn.disabled = true;

            try {
                // Get all survey data
                const surveyData = {
                    // Step 1: Employment Status
                    employment_status: document.querySelector('#step1 .option-btn.selected')?.dataset.value || '',
                    
                    // Step 2: Employment Type
                    employment_type: document.querySelector('#step2 .option-btn.selected')?.dataset.value || '',
                    
                    // Step 3: Documents & History
                    has_pay_slips: document.querySelectorAll('#step3 .option-btn.selected')[0]?.dataset.value || '',
                    previous_funds_history: document.querySelectorAll('#step3 .option-btn.selected')[1]?.dataset.value || '',
                    
                    // Step 4: Services & Contact
                    service_interest: document.querySelectorAll('#step4 .option-btn.selected')[0]?.dataset.value || '',
                    preferred_language: document.querySelectorAll('#step4 .option-btn.selected')[1]?.dataset.value || '',
                    
                    // Contact Information
                    full_name: document.querySelector('#surveyContactForm input[placeholder*="Name"]')?.value || '',
                    phone_number: document.querySelector('#surveyContactForm input[placeholder*="Phone"]')?.value || '',
                    email_address: document.querySelector('#surveyContactForm input[placeholder*="Email"]')?.value || ''
                };

                // Validate all fields are filled
                const emptyFields = Object.entries(surveyData).filter(([key, value]) => !value.trim());
                if (emptyFields.length > 0) {
                    alert('Please fill in all fields before submitting.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    return;
                }

                console.log('Submitting financial request:', surveyData);

                // Send to financial requests API
                const response = await fetch('https://mnjmoney-be.onrender.com/api/financial-requests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(surveyData)
                });
                
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    let errorMessage = `Server error: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.detail || errorMessage;
                    } catch (e) {
                        errorMessage = response.statusText || errorMessage;
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log('Success response:', result);
                
                if (result.success) {
                    // Show thank you step
                    document.getElementById('step4').style.display = 'none';
                    document.getElementById('thankYouStep').style.display = 'block';
                } else {
                    throw new Error(result.detail || 'Failed to submit survey');
                }
                
            } catch (error) {
                console.error('Error submitting survey:', error);
                if (error.message.includes('Failed to fetch')) {
                    alert('Network error: Cannot connect to server. Please check your internet connection.');
                } else if (error.message.includes('503')) {
                    alert('Server is temporarily unavailable. Please try again in a few moments.');
                } else {
                    alert(`Error: ${error.message}`);
                }
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });

    // Enhanced survey step validation
    function validateSurveyStep(step) {
        function getCurrentLanguage() {
            // Check if language is stored in localStorage
            const storedLang = localStorage.getItem('preferred-language');
            if (storedLang) return storedLang;
            
            // Check active language button
            const activeLangBtn = document.querySelector('.language-btn.active');
            if (activeLangBtn) {
                return activeLangBtn.getAttribute('data-lang');
            }
            
            // Default to Arabic
            return 'ar';
        }

        const currentLang = getCurrentLanguage();

        switch(step) {
            case 1:
                const step1Selected = document.querySelector('#step1 .option-btn.selected') !== null;
                if (!step1Selected) {
                    alert(translations[currentLang].step1Error);
                }
                return step1Selected;
                
            case 2:
                const step2Selected = document.querySelector('#step2 .option-btn.selected') !== null;
                if (!step2Selected) {
                    alert(translations[currentLang].step2Error);
                }
                return step2Selected;
                
            case 3:
                const step3Selections = document.querySelectorAll('#step3 .option-btn.selected');
                const step3Valid = step3Selections.length === 2;
                if (!step3Valid) {
                    alert(translations[currentLang].step3Error);
                }
                return step3Valid;
                
            case 4:
                const step4Selections = document.querySelectorAll('#step4 .option-btn.selected');
                const contactFields = document.querySelectorAll('#surveyContactForm input');
                const step4Valid = step4Selections.length === 2 && 
                               Array.from(contactFields).every(input => input.value.trim() !== '');
                
                if (!step4Valid) {
                    if (step4Selections.length < 2) {
                        alert(translations[currentLang].step4SelectionError);
                    } else {
                        alert(translations[currentLang].step4ContactError);
                    }
                }
                return step4Valid;
                
            default:
                return true;
        }
    }

    // Option button selection
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.survey-question');
            parent.querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Auto-advance to next step if this is step 1 or 2 with single questions
            if (parent.id === 'step1' || parent.id === 'step2') {
                setTimeout(() => {
                    if (parent.id === 'step1') {
                        document.getElementById('nextStep1').click();
                    } else if (parent.id === 'step2') {
                        document.getElementById('nextStep2').click();
                    }
                }, 500);
            }
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

        // Play button / overlay unified click
        videoWrappers.forEach((wrapper, index) => {
            const video = videos[index];
            const playBtn = wrapper.querySelector('.play-btn');

            wrapper.addEventListener('click', function(e) {
                // Ignore clicks outside overlay/play button if you want
                if (e.target !== playBtn && !e.target.closest('.play-btn')) return;

                if (video.paused) {
                    video.play().catch(err => console.error(err));
                } else {
                    video.pause();
                }
            });

            // Sync wrapper class and icon with video state
            video.addEventListener('play', () => {
                wrapper.classList.add('playing');
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });

            video.addEventListener('pause', () => {
                wrapper.classList.remove('playing');
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            });

            video.addEventListener('ended', () => {
                wrapper.classList.remove('playing');
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
        });
    }

    // Initialize video section
    initVideoSection();

    // WhatsApp floating button animation
    const whatsappFloat = document.getElementById('whatsappFloat');
    if (whatsappFloat) {
        setTimeout(() => {
            whatsappFloat.classList.add('animate-pulse');
        }, 2000);
    }
});