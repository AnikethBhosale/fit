// Modal functionality
const modal = document.getElementById('loginModal');
const loginBtn = document.querySelector('.login-btn');
const closeBtn = document.querySelector('.close');

loginBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach(t => t.classList.remove('active'));
  if (tab === 'login') {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    tabs[0].classList.add('active');
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    tabs[1].classList.add('active');
  }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Exercise Slider functionality
const initExerciseSlider = () => {
  const slider = document.querySelector('.exercise-cards');
  const cards = document.querySelectorAll('.exercise-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let currentSlide = 0;
  const maxSlide = 2; // We have 3 slides (0, 1, and 2)

  const showSlide = (index) => {
    slider.style.transform = `translateX(-${index * 33.333}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    
    // Update button states
    prevBtn.style.opacity = index === 0 ? '0.5' : '1';
    nextBtn.style.opacity = index === maxSlide ? '0.5' : '1';
  };

  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentSlide < maxSlide) {
      currentSlide++;
      showSlide(currentSlide);
    }
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  // Initialize first slide
  showSlide(0);
};

// Initialize progress bars
document.addEventListener('DOMContentLoaded', () => {
  initExerciseSlider();
  // Initialize reward progress bars
  document.querySelectorAll('.reward-progress').forEach(progress => {
    const value = progress.getAttribute('data-progress');
    progress.style.setProperty('--progress', `${value}%`);
  });

  // Initialize progress circles
  document.querySelectorAll('.progress-circle').forEach(circle => {
    const value = circle.getAttribute('data-progress');
    circle.style.background = `conic-gradient(#007bff ${value}%, #f0f0f0 0)`;
  });
});