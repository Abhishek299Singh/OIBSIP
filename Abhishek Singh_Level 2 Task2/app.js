/* ==========================================================================
   AMBIENT ELECTRIC SOUND GENERATOR (Web Audio API)
   ========================================================================== */
let audioCtx = null;
let humOscillator = null;
let humGain = null;
let staticOscillator = null;
let isPlayingAudio = false;

function initElectricHum() {
    try {
        // Create audio context
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Low transformer hum (50Hz - Tesla's favorite range)
        humOscillator = audioCtx.createOscillator();
        humOscillator.type = 'sawtooth';
        humOscillator.frequency.value = 50;
        
        // Lowpass filter to make it a deep rumble
        const lowpass = audioCtx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 100;
        
        // High frequency crackle/static (simulates electrical discharge)
        staticOscillator = audioCtx.createOscillator();
        staticOscillator.type = 'triangle';
        staticOscillator.frequency.value = 8000;
        
        const bandpass = audioCtx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 2500;
        bandpass.Q.value = 3.0;
        
        // Gain nodes for volume control
        humGain = audioCtx.createGain();
        humGain.gain.value = 0.05; // Keep it subtle
        
        const staticGain = audioCtx.createGain();
        staticGain.gain.value = 0.005; // Extremely quiet crackle
        
        // Connect nodes
        humOscillator.connect(lowpass);
        lowpass.connect(humGain);
        humGain.connect(audioCtx.destination);
        
        staticOscillator.connect(bandpass);
        bandpass.connect(staticGain);
        staticGain.connect(audioCtx.destination);
        
        // Start oscillators
        humOscillator.start();
        staticOscillator.start();
        isPlayingAudio = true;
    } catch (e) {
        console.error("Web Audio API not supported or blocked: ", e);
    }
}

function toggleAudio() {
    const btn = document.getElementById('audioToggle');
    if (!audioCtx) {
        initElectricHum();
        btn.classList.remove('muted');
        return;
    }

    if (isPlayingAudio) {
        audioCtx.suspend();
        isPlayingAudio = false;
        btn.classList.add('muted');
    } else {
        audioCtx.resume();
        isPlayingAudio = true;
        btn.classList.remove('muted');
    }
}

document.getElementById('audioToggle').addEventListener('click', toggleAudio);
// Initially set to muted visually
document.getElementById('audioToggle').classList.add('muted');


/* ==========================================================================
   HERO CANVAS LIGHTNING SIMULATOR
   ========================================================================== */
const heroCanvas = document.getElementById('lightningCanvas');
const heroCtx = heroCanvas.getContext('2d');

let width = heroCanvas.width = window.innerWidth;
let height = heroCanvas.height = window.innerHeight;

let mouseX = width / 2;
let mouseY = height / 2;
let targetMouseX = mouseX;
let targetMouseY = mouseY;

window.addEventListener('resize', () => {
    width = heroCanvas.width = window.innerWidth;
    height = heroCanvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
});

// Particles
class EnergyNode {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.baseGlow = Math.random() * 10 + 5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Boundary checks
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        heroCtx.beginPath();
        heroCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        heroCtx.fillStyle = 'rgba(0, 210, 255, 0.4)';
        heroCtx.shadowColor = '#00d2ff';
        heroCtx.shadowBlur = this.baseGlow;
        heroCtx.fill();
    }
}

const energyNodes = Array.from({ length: 45 }, () => new EnergyNode());

function drawLightning(x1, y1, x2, y2, segments, branchProbability) {
    heroCtx.beginPath();
    heroCtx.moveTo(x1, y1);

    let currX = x1;
    let currY = y1;

    for (let i = 1; i <= segments; i++) {
        const ratio = i / segments;
        const targetX = x1 + (x2 - x1) * ratio;
        const targetY = y1 + (y2 - y1) * ratio;

        // Add jagged displacement
        const offset = 8;
        const dispX = (Math.random() - 0.5) * offset;
        const dispY = (Math.random() - 0.5) * offset;

        const nextX = targetX + dispX;
        const nextY = targetY + dispY;

        heroCtx.lineTo(nextX, nextY);

        // Branching out logic
        if (Math.random() < branchProbability && i < segments - 1) {
            const bx = nextX + (Math.random() - 0.5) * 20;
            const by = nextY + (Math.random() - 0.5) * 20;
            drawLightning(nextX, nextY, bx, by, segments - i, 0.05);
        }

        currX = nextX;
        currY = nextY;
    }

    heroCtx.strokeStyle = 'rgba(112, 0, 255, 0.3)';
    heroCtx.lineWidth = 1.2;
    heroCtx.stroke();
    
    // Core white hot channel
    heroCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    heroCtx.lineWidth = 0.5;
    heroCtx.stroke();
}

function animateHero() {
    heroCtx.clearRect(0, 0, width, height);

    // Easing mouse coordinates
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    // Draw grid nodes
    energyNodes.forEach(node => {
        node.update();
        node.draw();
        
        // Link to mouse if close enough
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 180 && Math.random() < 0.15) {
            drawLightning(node.x, node.y, mouseX, mouseY, 5, 0.1);
        }
    });

    // Reset shadow blur
    heroCtx.shadowBlur = 0;
    
    requestAnimationFrame(animateHero);
}
animateHero();


/* ==========================================================================
   SCROLL INTERSECTION OBSERVER (Timeline & Animations)
   ========================================================================== */
const revealElements = document.querySelectorAll('.reveal-on-scroll');

const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

revealElements.forEach(element => {
    observer.observe(element);
});


/* ==========================================================================
   DYNAMIC STATS COUNTER
   ========================================================================== */
const statsSection = document.querySelector('.bio-stats');
const statCards = document.querySelectorAll('.stat-card');
let statsCounted = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
            startStatsCounter();
            statsCounted = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

function startStatsCounter() {
    statCards.forEach(card => {
        const numElement = card.querySelector('.stat-num');
        const target = parseInt(card.getAttribute('data-target'));
        const duration = 1800; // 1.8 seconds duration
        let start = 0;
        const stepTime = Math.max(Math.floor(duration / target), 15);
        
        const timer = setInterval(() => {
            if (target > 500) {
                // For big numbers, jump in larger steps
                start += Math.ceil(target / 40);
            } else {
                start++;
            }

            if (start >= target) {
                numElement.textContent = target;
                clearInterval(timer);
            } else {
                numElement.textContent = start;
            }
        }, stepTime);
    });
}


/* ==========================================================================
   INTERACTIVE WIRELESS LAB MODULE
   ========================================================================== */
const labPlayground = document.getElementById('labPlayground');
const bulbNode = document.getElementById('bulbNode');
const towerNode = document.getElementById('towerNode');
const labCanvas = document.getElementById('labSparkCanvas');
const labCtx = labCanvas.getContext('2d');

const efficiencyFill = document.getElementById('efficiencyFill');
const efficiencyVal = document.getElementById('efficiencyVal');
const voltageFill = document.getElementById('voltageFill');
const voltageVal = document.getElementById('voltageVal');
const energizeBtn = document.getElementById('energizeBtn');

// Resizing Lab Canvas
function resizeLabCanvas() {
    labCanvas.width = labPlayground.clientWidth;
    labCanvas.height = labPlayground.clientHeight;
}
resizeLabCanvas();
window.addEventListener('resize', resizeLabCanvas);

// Interactive dragging
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let resonanceMultiplier = 1.0;

// Get Tower positioning relative to lab playground
function getTowerTopPos() {
    const rect = labPlayground.getBoundingClientRect();
    const towerRect = towerNode.getBoundingClientRect();
    
    return {
        x: (towerRect.left + towerRect.width / 2) - rect.left,
        y: (towerRect.top + 20) - rect.top // Top dome location
    };
}

// Get Bulb center relative to lab playground
function getBulbCenterPos() {
    const rect = labPlayground.getBoundingClientRect();
    const bulbRect = bulbNode.getBoundingClientRect();
    
    return {
        x: (bulbRect.left + bulbRect.width / 2) - rect.left,
        y: (bulbRect.top + bulbRect.height / 2) - rect.top
    };
}

// Draggable handlers
bulbNode.addEventListener('mousedown', (e) => {
    isDragging = true;
    const bulbRect = bulbNode.getBoundingClientRect();
    offsetX = e.clientX - bulbRect.left;
    offsetY = e.clientY - bulbRect.top;
    bulbNode.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const rect = labPlayground.getBoundingClientRect();
    let left = e.clientX - rect.left - offsetX;
    let top = e.clientY - rect.top - offsetY;

    // Bounds checking
    const padding = 15;
    const maxLeft = rect.width - bulbNode.clientWidth - padding;
    const maxTop = rect.height - bulbNode.clientHeight - padding;
    
    left = Math.max(padding, Math.min(left, maxLeft));
    top = Math.max(padding, Math.min(top, maxTop));

    bulbNode.style.left = `${left}px`;
    bulbNode.style.top = `${top}px`;
    
    updateLabEnergy();
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        bulbNode.style.transition = 'all 0.1s ease';
    }
});

// Touch support for mobile dragging
bulbNode.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    const bulbRect = bulbNode.getBoundingClientRect();
    offsetX = touch.clientX - bulbRect.left;
    offsetY = touch.clientY - bulbRect.top;
    bulbNode.style.transition = 'none';
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const rect = labPlayground.getBoundingClientRect();
    let left = touch.clientX - rect.left - offsetX;
    let top = touch.clientY - rect.top - offsetY;

    const padding = 15;
    const maxLeft = rect.width - bulbNode.clientWidth - padding;
    const maxTop = rect.height - bulbNode.clientHeight - padding;
    
    left = Math.max(padding, Math.min(left, maxLeft));
    top = Math.max(padding, Math.min(top, maxTop));

    bulbNode.style.left = `${left}px`;
    bulbNode.style.top = `${top}px`;
    
    updateLabEnergy();
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', () => {
    isDragging = false;
});

// Resonator boost button
let isBoosting = false;
energizeBtn.addEventListener('click', () => {
    if (isBoosting) return;
    isBoosting = true;
    resonanceMultiplier = 2.2;
    
    // Add glowing state to buttons/nodes
    energizeBtn.textContent = "Resonance Maximized!";
    energizeBtn.classList.remove('pulse');
    energizeBtn.style.background = 'var(--color-cyan)';
    energizeBtn.style.color = '#000';
    document.querySelector('.tower-glow').style.transform = 'translate(-50%) scale(2)';
    document.querySelector('.tower-glow').style.background = '#fff';
    document.querySelector('.tower-glow').style.boxShadow = '0 0 30px #fff, 0 0 60px var(--color-cyan)';
    
    // Flash play area
    labPlayground.style.boxShadow = 'inset 0 0 80px rgba(0, 210, 255, 0.4)';
    
    setTimeout(() => {
        resonanceMultiplier = 1.0;
        isBoosting = false;
        energizeBtn.textContent = "Boost Resonant Frequency";
        energizeBtn.classList.add('pulse');
        energizeBtn.style.background = 'transparent';
        energizeBtn.style.color = 'var(--color-cyan)';
        document.querySelector('.tower-glow').style.transform = 'translate(-50%) scale(1)';
        document.querySelector('.tower-glow').style.background = 'var(--color-cyan)';
        document.querySelector('.tower-glow').style.boxShadow = '0 0 10px var(--color-cyan), 0 0 25px var(--color-cyan)';
        labPlayground.style.boxShadow = 'inset 0 0 50px rgba(0, 0, 0, 0.4)';
        updateLabEnergy();
    }, 4500);
});

// Electrical discharges in lab
function drawJaggedLine(x1, y1, x2, y2, segments, amplitude, color, width) {
    labCtx.beginPath();
    labCtx.moveTo(x1, y1);

    for (let i = 1; i <= segments; i++) {
        const ratio = i / segments;
        const targetX = x1 + (x2 - x1) * ratio;
        const targetY = y1 + (y2 - y1) * ratio;

        // Normal displacement offset vector
        const normalX = -(y2 - y1);
        const normalY = (x2 - x1);
        const len = Math.sqrt(normalX * normalX + normalY * normalY);
        
        let disp = (Math.random() - 0.5) * amplitude;
        const dispX = (normalX / len) * disp;
        const dispY = (normalY / len) * disp;

        labCtx.lineTo(targetX + dispX, targetY + dispY);
    }

    labCtx.strokeStyle = color;
    labCtx.lineWidth = width;
    labCtx.shadowBlur = 10;
    labCtx.shadowColor = color;
    labCtx.stroke();
    labCtx.shadowBlur = 0;
}

function updateLabEnergy() {
    const tower = getTowerTopPos();
    const bulb = getBulbCenterPos();
    
    const dx = bulb.x - tower.x;
    const dy = bulb.y - tower.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Efficiency computation
    const maxDist = 380;
    let efficiency = Math.max(0, 100 * (1 - dist / maxDist));
    efficiency *= resonanceMultiplier;
    efficiency = Math.min(100, Math.round(efficiency));

    // Voltage computation (peak standard bulb at 120V)
    let voltage = Math.max(0, 120 * (1 - dist / maxDist));
    voltage *= resonanceMultiplier;
    voltage = Math.min(220, Math.round(voltage));

    // Update displays
    efficiencyFill.style.width = `${efficiency}%`;
    efficiencyVal.textContent = `${efficiency}%`;
    voltageFill.style.width = `${(voltage/220)*100}%`;
    voltageVal.textContent = `${voltage} V`;

    // Glow and bulb updates
    const bulbGlass = document.querySelector('.bulb-glass');
    const bulbGlow = document.querySelector('.bulb-glow');
    const bulbIcon = bulbGlass.querySelector('i');
    
    if (voltage > 10) {
        const factor = Math.min(1.0, voltage / 120);
        bulbGlass.style.borderColor = `rgba(255, 179, 0, ${0.4 + factor * 0.6})`;
        bulbGlass.style.boxShadow = `0 0 ${10 + factor * 30}px rgba(255, 179, 0, ${factor * 0.5})`;
        bulbIcon.style.color = `rgba(255, 179, 0, ${0.3 + factor * 0.7})`;
        bulbGlow.style.opacity = factor;
    } else {
        bulbGlass.style.borderColor = '#555';
        bulbGlass.style.boxShadow = 'none';
        bulbIcon.style.color = 'rgba(255, 255, 255, 0.15)';
        bulbGlow.style.opacity = 0;
    }
}

// Render loop for sparks
function renderSparks() {
    labCtx.clearRect(0, 0, labCanvas.width, labCanvas.height);

    const tower = getTowerTopPos();
    const bulb = getBulbCenterPos();
    
    const dx = bulb.x - tower.x;
    const dy = bulb.y - tower.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const maxDist = 380;

    // Trigger electric arcs based on distance and boost status
    if (dist < maxDist || isBoosting) {
        let triggerProbability = 0.05 + (1 - dist / maxDist) * 0.45;
        if (isBoosting) triggerProbability = 0.85;

        if (Math.random() < triggerProbability) {
            const amplitude = Math.max(5, (dist / maxDist) * 35);
            const segments = Math.max(4, Math.floor(dist / 25));
            
            // Draw electric blue core outer layer
            drawJaggedLine(
                tower.x, tower.y, bulb.x, bulb.y, 
                segments, amplitude, 'rgba(0, 210, 255, 0.6)', 2.5
            );
            
            // Inner neon white channel
            drawJaggedLine(
                tower.x, tower.y, bulb.x, bulb.y, 
                segments, amplitude * 0.8, '#ffffff', 0.8
            );

            // Audio crackle modulator (low static crackle sound)
            if (isPlayingAudio && Math.random() < 0.3) {
                const now = audioCtx.currentTime;
                // Temporarily raise static volume
                const node = audioCtx.createOscillator();
                node.type = 'triangle';
                node.frequency.value = 4000 + Math.random() * 2000;
                
                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.008, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
                
                node.connect(gain);
                gain.connect(audioCtx.destination);
                node.start(now);
                node.stop(now + 0.09);
            }
        }
    }

    requestAnimationFrame(renderSparks);
}

// Initial positioning of bulb node
setTimeout(() => {
    bulbNode.style.left = '65%';
    bulbNode.style.top = '35%';
    updateLabEnergy();
    renderSparks();
}, 200);


/* ==========================================================================
   WISDOM QUOTES ROTATOR
   ========================================================================== */
const slides = document.querySelectorAll('.quote-slide');
const dots = document.querySelectorAll('.slide-dots .dot');
const prevBtn = document.getElementById('prevQuote');
const nextBtn = document.getElementById('nextQuote');
let currentSlide = 0;
let slideInterval = null;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Set up automatic slides
function startQuoteTimer() {
    stopQuoteTimer();
    slideInterval = setInterval(nextSlide, 7000);
}

function stopQuoteTimer() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

nextBtn.addEventListener('click', () => {
    nextSlide();
    startQuoteTimer();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    startQuoteTimer();
});

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        showSlide(index);
        startQuoteTimer();
    });
});

startQuoteTimer();


/* ==========================================================================
   EXPLORE BUTTON POWER ON EFFECT
   ========================================================================== */
const exploreBtn = document.getElementById('exploreBtn');
exploreBtn.addEventListener('click', () => {
    // Scroll down to the Lab section
    document.getElementById('lab').scrollIntoView({ behavior: 'smooth' });
    
    // Trigger resonant boost automatically
    setTimeout(() => {
        if (!isBoosting) {
            energizeBtn.click();
        }
    }, 800);
});
