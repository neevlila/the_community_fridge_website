document.addEventListener('DOMContentLoaded', () => {
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const header = document.getElementById('header');
const themeToggle = document.getElementById('theme-toggle');

// --- Theme Toggler ---
const applyTheme = (theme) => {
document.documentElement.setAttribute('data-theme', theme);
localStorage.setItem('theme', theme);
};

const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
applyTheme(newTheme);
});


// --- Mobile Navigation ---
hamburger.addEventListener('click', () => {
hamburger.classList.toggle('active');
navMenu.classList.toggle('active');
});

// --- Smooth Scrolling ---
const headerHeight = header.offsetHeight;
const scrollLinks = document.querySelectorAll('.scroll-link');
scrollLinks.forEach(link => {
link.addEventListener('click', (e) => {
e.preventDefault();
const targetId = link.getAttribute('href');
const targetElement = document.querySelector(targetId);

if (targetElement) {
const targetPosition = targetId === '#home' ? targetElement.offsetTop : targetElement.offsetTop - headerHeight;
window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}

if (navMenu.classList.contains('active')) {
hamburger.classList.remove('active');
navMenu.classList.remove('active');
}
});
});

// --- Header Shadow on Scroll ---
window.addEventListener('scroll', () => {
if (window.scrollY > 50) {
header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
} else {
header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
}
});

// --- Hero Animation ---
anime({
targets: '.hero-content .anim-el',
translateY: [30, 0],
opacity: [0, 1],
delay: anime.stagger(200, { start: 300 }),
duration: 1000,
easing: 'easeOutExpo'
});

// --- "How It Works" Section ---
const stepCards = document.querySelectorAll('.step-card');
const stepDetails = document.getElementById('stepDetails');
const stepInfo = {
1: 'We actively reach out to local restaurants, cafés, bakeries, and grocery stores in Ahmedabad to form partnerships. These businesses commit to donating their safe, surplus food instead of discarding it, helping reduce waste while supporting the community.',
2: 'Our dedicated team of volunteers visits partner businesses daily to collect fresh surplus food. All collected items are carefully checked to ensure they meet safety and quality standards before being transported to our community fridges.',
3: 'The donated food is organized and properly stored in our clean, well-maintained public refrigerators. We categorize items by type and ensure everything is clearly labeled with collection dates to maintain freshness and food safety.',
4: 'Our fridges are accessible 24/7 to anyone in need. There are no forms to fill, no questions asked, and no judgment. Community members can simply take what they need with complete dignity and privacy.',
5: 'Hygiene is our top priority. Our volunteer team conducts daily inspections and cleaning of all fridges. We monitor temperatures, remove expired items, and ensure the space remains welcoming and safe for all users.'
};

stepCards.forEach(card => {
card.addEventListener('click', () => {
const stepNumber = card.getAttribute('data-step');
stepDetails.innerHTML = `<p>${stepInfo[stepNumber]}</p>`;
stepDetails.classList.add('active');

stepCards.forEach(c => c.classList.remove('active'));
card.classList.add('active');
});
});

// --- "Our Impact" Stats Animation ---
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting && !statsAnimated) {
statNumbers.forEach(stat => {
const target = parseInt(stat.getAttribute('data-target'));
let counter = { value: 0 };
anime({
targets: counter,
value: target,
round: 1,
duration: 2000,
easing: 'easeOutCubic',
update: function() {
stat.innerHTML = counter.value;
},
complete: function() {
if (stat.getAttribute('data-target') === '500' || stat.getAttribute('data-target') === '15') {
stat.innerHTML += '+';
}
}
});
});
statsAnimated = true;
}
});
}, { threshold: 0.5 });

const impactSection = document.getElementById('impact');
if (impactSection) {
statsObserver.observe(impactSection);
}

// --- Testimonials Slider ---
const testimonials = [
{
text: '"The Community Fridge has been a lifeline for my family. No judgment, just kindness and good food when we need it most."',
author: '— Priya S., Community Member'
},
{
text: '"As a restaurant owner, I\'m thrilled we can redirect our surplus food to help our neighbours instead of wasting it. It\'s a win-win."',
author: '— Rajesh P., Local Business Partner'
},
{
text: '"Volunteering here has shown me the true power of community. Every small action creates a ripple of change."',
author: '— Ananya M., Volunteer'
}
];

let currentTestimonial = 0;
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialDots = document.getElementById('testimonialDots');

function renderTestimonials() {
testimonialTrack.innerHTML = '';
testimonials.forEach((t, index) => {
const card = document.createElement('div');
card.classList.add('testimonial-card');
if (index === 0) card.classList.add('active');
card.innerHTML = `
<p class="testimonial-text">${t.text}</p>
<p class="testimonial-author">${t.author}</p>
`;
testimonialTrack.appendChild(card);

const dot = document.createElement('div');
dot.classList.add('testimonial-dot');
if (index === 0) dot.classList.add('active');
dot.addEventListener('click', () => showTestimonial(index));
testimonialDots.appendChild(dot);
});
}

const showTestimonial = (index) => {
const cards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.testimonial-dot');
if (index === currentTestimonial && cards.length > 1) return;
const currentCard = cards[currentTestimonial];
const nextCard = cards[index];
currentCard.classList.remove('active');
nextCard.classList.add('active');
dots.forEach(dot => dot.classList.remove('active'));
dots[index].classList.add('active');
currentTestimonial = index;
};

if (testimonialTrack) {
renderTestimonials();
setInterval(() => {
let nextIndex = (currentTestimonial + 1) % testimonials.length;
showTestimonial(nextIndex);
}, 5000);
}

// --- Contact Form Logic ---
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const formResult = document.getElementById('formResult');

const validateEmail = (email) => {
const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return re.test(String(email).toLowerCase());
};

const showError = (input, errorElement, message) => {
input.classList.add('error');
errorElement.textContent = message;
errorElement.classList.add('show');
};

const clearError = (input, errorElement) => {
input.classList.remove('error');
errorElement.textContent = '';
errorElement.classList.remove('show');
};

if (contactForm) {
contactForm.addEventListener('submit', (e) => {
e.preventDefault();
let isValid = true;

clearError(nameInput, nameError);
clearError(emailInput, emailError);
clearError(messageInput, messageError);

if (nameInput.value.trim() === '') {
showError(nameInput, nameError, 'Please enter your name.');
isValid = false;
}

if (emailInput.value.trim() === '') {
showError(emailInput, emailError, 'Please enter your email.');
isValid = false;
} else if (!validateEmail(emailInput.value.trim())) {
showError(emailInput, emailError, 'Please enter a valid email address.');
isValid = false;
}

if (messageInput.value.trim() === '') {
showError(messageInput, messageError, 'Please enter a message.');
isValid = false;
}

if (!isValid) {
return;
}

const formData = new FormData(contactForm);
const object = Object.fromEntries(formData);
const json = JSON.stringify(object);

formResult.style.display = 'block';
formResult.style.color = 'var(--primary-color)';
formResult.innerHTML = "Sending message, please wait...";

fetch('https://api.web3forms.com/submit', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Accept': 'application/json'
},
body: json
})
.then(async (response) => {
let jsonResponse = await response.json();
if (response.status == 200) {
formResult.style.color = '#28a745';
formResult.innerHTML = jsonResponse.message || "Form submitted successfully!";
} else {
console.log(response);
formResult.style.color = '#d32f2f';
formResult.innerHTML = jsonResponse.message || "Something went wrong!";
}
})
.catch(error => {
console.log(error);
formResult.style.color = '#d32f2f';
formResult.innerHTML = "Something went wrong!";
})
.then(function() {
if (formResult.style.color === 'rgb(40, 167, 69)') {
contactForm.reset();
}
setTimeout(() => {
formResult.style.display = "none";
formResult.innerHTML = "";
}, 5000);
});
});
}
});
