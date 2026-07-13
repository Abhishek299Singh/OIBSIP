# 🧮 Quantum Calc — Premium Glassmorphic Calculator

Quantum Calc is a premium, polished calculator web application designed with modern glassmorphism aesthetics, fluid micro-animations, standard pocket calculator mathematics, and physical keyboard support.

---

## 🌟 Features

- **Obsidian Glass Design**: Uses backdrop-filter blur effects, smooth gradients, glowing outer borders, and ambient floating backlights for a modern, futuristic UI.
- **Theme Switcher**: Seamlessly toggles between **Obsidian Dark** and **Opal Light** themes with state preservation using `localStorage` so your preferences are saved.
- **Mathematical Accuracy**: Implements a custom rounding system to resolve JavaScript floating-point precision issues (e.g., `0.1 + 0.2 = 0.3`), bounds checking for dividing by zero, and native percentage (`%`) scaling.
- **Calculation History Panel**: A slide-out sidebar drawer that logs calculation history, allowing you to click past results to reload them into the main display.
- **Physical Keyboard Integration**: Binds standard computer keyboard keys directly to the calculator buttons, triggering visual press states for interactive feedback.
- **Fully Responsive Layout**: Built with custom CSS flexbox/grid layout systems to adapt elegantly across mobile, tablet, and desktop viewports.

---

## 🛠️ Technologies Used

- **HTML5**: Structured semantic layout, meta descriptions, and clean markup.
- **CSS3 (Vanilla)**: Theme variables, glassmorphic styling, flexbox/grid alignments, keyframe glow animations, and active state transitions.
- **JavaScript (Vanilla)**: OOP architecture (`Calculator` class), mathematical evaluation engine, custom float rounding, history management, and keyboard event handlers.
- **Google Fonts**: Uses the premium *Outfit* font family for clean, modern readability.

---

## 📂 Folder Structure

```
Calculator/
├── index.html   # Calculator structure, controls, and layout
├── style.css    # Responsive CSS design tokens, glassmorphism, and themes
└── script.js    # OOP Calculator engine, memory states, and keyboard bindings
```

---

## 🚀 How to Run the Project

1. **Locate the files** on your computer.
2. **Double-click** the `index.html` file to open the calculator directly in any web browser.
3. Alternatively, spin up a local development server in the repository directory (e.g., `python -m http.server 8000` or `npx serve .`) and visit `http://localhost:8000/Calculator/`.

---

## 👤 Author

- **Abhishek Singh**
- *Oasis Infobyte Web Development & Designing Internship (Level 2 Task 1)*
