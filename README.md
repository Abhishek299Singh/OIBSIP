# 🌌 Oasis Infobyte SIP - Web Development Tasks

This repository contains my frontend development submissions for the AICTE Oasis Infobyte Summer Internship Program (SIP).

## 📂 Project Structure

The repository is organized into distinct subdirectories for each task:

```
OIBSIP/
├── ToDoList/               # Task 3: FlowTask Minimalist To-Do Web App
│   ├── index.html          # Layout, forms, and counts
│   ├── style.css           # Theme styles, custom checkboxes, animations
│   ├── script.js           # State management, local storage, animation logic
│   └── README.md           # Task documentation
│
├── Calculator/             # Task 1: Premium Glassmorphic Calculator
│   ├── index.html          # HTML structure & keyboard layouts
│   ├── style.css           # Glassmorphism design & color variables
│   └── script.js           # Calculator math engine & keyboard controls
│
├── TributePage/            # Task 2: Nikola Tesla Tribute Page
│   ├── index.html          # Semantic page layout & inline SVG vector graphs
│   ├── styles.css          # Cyber-electric theme, layouts & keyframes
│   ├── app.js              # Canvas simulations & Web Audio hum synth
│   └── assets/             # Historical visual assets
│       └── tesla_hero.jpg  # Vintage photograph of Nikola Tesla
│
└── README.md               # Main repository documentation
```

---

## 📝 Task 3: FlowTask (Minimalist To-Do Web Application)

A premium, clean, and responsive to-do application built with semantic HTML5, modern CSS3 (with automatic light/dark mode based on system preferences), and Vanilla JavaScript.

### ✨ To-Do List Features
- **Intelligent Task State Management**: Segregates pending tasks from completed tasks automatically.
- **Custom Interactive Checkboxes**: Features smooth scale transitions and animated checkmarks.
- **Seamless LocalStorage Integration**: Keeps your daily intentions synchronized across reload/close cycles.
- **Fluid Micro-Animations**: Employs fade-out and slide-in visual transitions when adding, completing, or removing items.
- **Fully Responsive Design**: Styled from scratch to scale elegantly across mobiles, tablets, and desktops.

---

## ⚡ Task 2: Nikola Tesla Tribute Page (The Maverick of Electricity)

A premium, highly interactive single-page application built using HTML5, CSS3, and Vanilla JavaScript, honoring the legacy of Nikola Tesla.

### ✨ Tribute Page Features
- **Interactive Lightning Canvas Background**: Features a custom-rendered physics canvas in the Hero section. Floating energy nodes trace dynamic electric sparks to the user's cursor on hover.
- **Interactive Wireless Transmission Lab**: 
  - Users can click-and-drag the **Receiver Bulb** closer to the **Wardenclyffe Tower**.
  - A dedicated canvas draws jagged electrical arcs connecting the two nodes as they approach.
  - Interactive dashboard meters dynamically display power efficiency and voltage levels.
  - A **Boost Resonant Frequency** button triggers a temporary power overload, visual flashing, and metric jumps.
- **Web Audio Hum Synthesizer**: Generates low-frequency AC electrical transformer hum and high-frequency spark crackles directly in code using browser oscillators when toggled.
- **Dynamic Stats Counter**: Important statistics (300+ patents, etc.) count up dynamically when scrolled into view.
- **Wisdom Quotes Rotator**: A smooth quote carousel fading through his most inspiring words.
- **Historical Assets**: Features the iconic photograph of Tesla holding a glowing wireless light bulb.

---

## 🧮 Task 1: Quantum Calc (Premium Glassmorphic Calculator)

A polished calculator web application designed with modern glassmorphism aesthetics, fluid micro-animations, standard pocket calculator mathematics, and physical keyboard support.

### ✨ Calculator Features
- **Obsidian Glass Design**: backdrop filters, glowing outer borders, and ambient floating backlights.
- **Theme Switcher**: Fluid toggle between **Obsidian Dark** and **Opal Light** themes with `localStorage` state preservation.
- **Mathematical Accuracy**: Custom floating-point rounding system to resolve Javascript precision issues, bounds checking for dividing by zero, and native percentage (`%`) operator scaling.
- **Physical Keyboard Integration**: Binds physical keyboard keys to the UI buttons, triggering visual presses.

---

## 🚀 How to Run Locally

Since these are pure static frontend applications (no node packages or bundlers required), you can launch them directly:

1. Clone this repository:
   ```bash
   git clone https://github.com/Abhishek299Singh/OIBSIP.git
   ```
2. Navigate into any directory:
   - Double-click `index.html` inside `ToDoList/`, `Calculator/`, or `TributePage/` to open it in any modern web browser.
   - Alternatively, spin up a local development server in the repository directory:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     ```
3. Open `http://localhost:8000` in your web browser.
