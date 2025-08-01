// Global variables
let currentCourse = null;
let currentAmount = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add smooth scrolling to all anchor links
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

    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all course cards and feature cards
    document.querySelectorAll('.course-card, .feature-card, .review-card, .story-card').forEach(card => {
        observer.observe(card);
    });
}

// Course Functions
function buyNow(courseName, amount) {
    currentCourse = courseName;
    currentAmount = amount;
    
    // Store in localStorage for persistence across pages
    localStorage.setItem('selectedCourse', courseName);
    localStorage.setItem('selectedAmount', amount);
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

function viewCourse(courseName) {
    currentCourse = courseName;
    localStorage.setItem('selectedCourse', courseName);
    
    // Get course details
    const courseDetails = getCourseDetails(courseName);
    localStorage.setItem('selectedAmount', courseDetails.price);
    
    // Redirect to course detail page
    window.location.href = 'course-detail.html';
}

function getCourseDetails(courseName) {
    const courses = {
        'AI/ML': {
            price: 99,
            description: 'Master artificial intelligence and machine learning concepts with hands-on projects and real-world applications.',
            features: [
                'Introduction to Machine Learning',
                'Deep Learning Fundamentals',
                'Neural Networks and TensorFlow',
                'Computer Vision Projects',
                'Natural Language Processing',
                'Model Deployment and Production'
            ]
        },
        'Data Science': {
            price: 99,
            description: 'Learn to analyze data, create visualizations, and extract meaningful insights using Python and advanced statistical methods.',
            features: [
                'Python for Data Science',
                'Data Visualization with Matplotlib & Seaborn',
                'Statistical Analysis and Hypothesis Testing',
                'Pandas and NumPy Mastery',
                'Machine Learning for Data Science',
                'Real-world Data Science Projects'
            ]
        },
        'Cloud Computing': {
            price: 99,
            description: 'Build scalable applications in the cloud using AWS, Azure, and Google Cloud Platform with industry best practices.',
            features: [
                'Cloud Computing Fundamentals',
                'AWS Services and Architecture',
                'Azure and Google Cloud Platform',
                'DevOps and CI/CD Pipelines',
                'Containerization with Docker & Kubernetes',
                'Cloud Security Best Practices'
            ]
        },
        'Generative AI': {
            price: 99,
            description: 'Explore the world of generative AI, including GPT models, image generation, and building AI-powered applications.',
            features: [
                'Introduction to Generative AI',
                'Working with GPT Models',
                'Image Generation with DALL-E',
                'Building AI-Powered Applications',
                'Prompt Engineering Techniques',
                'Ethics and Future of AI'
            ]
        },
        'Digital Marketing Bootcamp': {
            price: 1999,
            description: 'Comprehensive digital marketing course covering SEO, SEM, Social Media Marketing, Content Marketing, Email Marketing, and Analytics.',
            features: [
                'Search Engine Optimization (SEO)',
                'Search Engine Marketing (SEM)',
                'Social Media Marketing Strategy',
                'Content Marketing and Copywriting',
                'Email Marketing Automation',
                'Google Analytics and Data Analysis',
                'Conversion Rate Optimization',
                'Digital Marketing Strategy and Planning'
            ]
        }
    };
    
    return courses[courseName] || { price: 99, description: 'Course description not available.', features: [] };
}

// Course Detail Page Functions
function loadCourseDetails() {
    const courseName = localStorage.getItem('selectedCourse');
    if (!courseName) {
        window.location.href = 'courses.html';
        return;
    }
    
    const courseDetails = getCourseDetails(courseName);
    
    // Update page content
    document.getElementById('courseTitle').textContent = courseName;
    document.getElementById('courseDescription').textContent = courseDetails.description;
    document.getElementById('coursePrice').textContent = `₹${courseDetails.price}`;
    
    // Update course preview
    const previewContainer = document.getElementById('coursePreview');
    if (previewContainer) {
        previewContainer.innerHTML = courseDetails.features.map(feature => `
            <div class="col-md-6 mb-3">
                <div class="d-flex align-items-center">
                    <i class="fas fa-check-circle text-success me-3"></i>
                    <span>${feature}</span>
                </div>
            </div>
        `).join('');
    }
}

function redirectToPayment() {
    const courseName = localStorage.getItem('selectedCourse');
    const amount = localStorage.getItem('selectedAmount');
    
    if (courseName && amount) {
        window.location.href = 'payment.html';
    } else {
        alert('Please select a course first.');
        window.location.href = 'courses.html';
    }
}
function loadPaymentDetails() {
    const courseName = localStorage.getItem('selectedCourse');
    const amount = localStorage.getItem('selectedAmount');

    if (!courseName || !amount) {
        window.location.href = 'courses.html';
        return;
    }

    document.getElementById('selectedCourse').textContent = courseName;
    document.getElementById('courseAmount').textContent = `₹${amount}`;

    const upiUrl = `upi://pay?pa=anjitha.ajith1312@oksbi&pn=Vytek Academy&am=${amount}&cu=INR&tn=Payment for ${courseName}`;
    document.getElementById('gpayRedirectBtn').setAttribute('href', upiUrl);

    // Generate QR code
    const qrCodeImg = document.getElementById('qrImage');
    qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
}


function proceedToForm() {
    window.location.href = 'post-payment-form.html';
}
window.onload = function () {
    loadFormDetails();
};

function submitForm(event) {
    event.preventDefault();

    const course = document.getElementById('selectedCourseForm').innerText;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const comments = document.getElementById('comments').value;

    const formData = new FormData();
    formData.append('course', course);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('comments', comments);

    fetch('https://script.google.com/macros/s/AKfycbwL7IbrsB72Z4eCnVGK8OVqI34eNjNXZOQVJuh3a4j_s2f4XyGJa3C3kHGJOSh5JHU/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(responseText => {
        document.getElementById("paymentConfirmationForm").reset();
        showSuccessModal(); // show modal instead of alert
    })
    .catch(error => {
        console.error("Error!", error.message);
        alert("There was an error submitting the form.");
    });
}
function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center p-5">
                    <i class="fas fa-check-circle text-success mb-4" style="font-size: 4rem;"></i>
                    <h3 class="fw-bold text-success mb-3">Submission Successful!</h3>
                    <p class="text-muted mb-4">Thank you for your submission. We'll verify your payment and send you course access details within 24 hours.</p>
                    <button class="btn btn-primary btn-lg" onclick="goToHome()">Go to Home</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function goToHome() {
    localStorage.removeItem('selectedCourse');
    localStorage.removeItem('selectedAmount');
    window.location.href = 'index.html';
}





function loadMoreReviews() {
    showToast('More reviews loaded!', 'success');
    // In a real application, this would load more reviews from the server
}

// Add drag and drop functionality for file uploads
document.addEventListener('DOMContentLoaded', function() {
    const uploadAreas = document.querySelectorAll('.qr-upload-area, .upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileInput = this.querySelector('input[type="file"]');
                if (fileInput) {
                    fileInput.files = files;
                    fileInput.dispatchEvent(new Event('change'));
                }
            }
        });
    });
});

// Add smooth page transitions
function addPageTransition() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });
}

// Initialize page transitions
addPageTransition();

// Add scroll-to-top functionality
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'btn btn-primary position-fixed';
    scrollBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 999; border-radius: 50%; width: 50px; height: 50px; display: none;';
    scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
}

// Initialize scroll to top
addScrollToTop();