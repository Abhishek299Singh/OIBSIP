# 🌌 Quantum Calc - Premium Glassmorphic Calculator

Quantum Calc is a highly-polished, responsive calculator web application designed with modern glassmorphism aesthetics, fluid micro-animations, standard pocket calculator mathematics, and full physical keyboard support.

![Responsive Design](https://img.shields.io/badge/Responsive-Yes-brightgreen)
![Pure Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-blue)
![License](https://img.shields.io/badge/License-MIT-orange)

## ✨ Features

- **Obsidian Glass Design**: Beautiful backdrop filters, dynamic outer borders, and dual ambient glowing lights that float in the background.
- **Responsive Layout**: Fluid column grids that wrap perfectly from mobile screens (supports landscape and portrait viewports) to large monitors.
- **Theme Switcher**: Fluid toggle between **Obsidian Dark** and **Opal Light** themes with automatic storage preservation (`localStorage`).
- **Mathematical Accuracy**:
  - Handles basic arithmetic: Addition, Subtraction, Multiplication, Division.
  - Custom floating-point rounding system to resolve standard JS float bugs (e.g. `0.1 + 0.2 = 0.3`).
  - Native percentage (`%`) operator scaling.
  - Robust bounds checking for division by zero (shows `"Cannot divide by 0"`).
- **Physical Keyboard Integration**: Fully interactive keyboard map that visually presses the corresponding buttons in the grid.
- **Compact Viewport Optimization**: Dynamically shrinks font sizes on long input strings to avoid numerical overflows.

## 🚀 How to Run Locally

Since this is a standard frontend application with no external dependencies or bundlers, it can be launched directly:

1. Clone or download the repository.
2. Double-click the [index.html](file:///C:/Users/STUDENT/Desktop/project/index.html) file to open it in any modern browser.
3. *Alternatively*, spin up a local development server in the project directory:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```

## ☁️ Uploading to GitHub without Git CLI

Since Git is not installed on this system by default, a custom PowerShell script `upload_to_github.ps1` is included in this folder. To use it:
1. Open PowerShell inside the project folder (`C:\Users\STUDENT\Desktop\project`).
2. Run:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\upload_to_github.ps1
   ```
3. Input your GitHub username, the desired repository name, and a GitHub Personal Access Token (PAT).

Alternatively, you can open this folder using **Visual Studio Code** (available on your Desktop) and click the **Publish to GitHub** button under the Source Control tab, which handles authentication automatically through your browser.

## 🎹 Keyboard Shortcuts

The app automatically binds your physical keyboard to the UI inputs:

| Keyboard Key | Action |
|---|---|
| `0` - `9` | Appends digits |
| `.` | Appends decimal |
| `+` | Add |
| `-` | Subtract |
| `*` | Multiply |
| `/` | Divide |
| `%` | Percent |
| `Backspace` | Delete last digit (DEL) |
| `Escape` or `Delete` | Clear all (AC) |
| `Enter` or `=` | Compute formula (=) |

## 📂 Project Structure

```
project/
├── index.html            # Main layout structure & accessibility tags
├── style.css             # Responsive CSS variables, glassmorphic layout, & keyframes
├── script.js             # OOP Calculator class, theme handling, and history engine
├── upload_to_github.ps1  # Custom PowerShell script to upload to GitHub via API
└── .gitignore            # Git files exclusion configuration
```

## 📝 License
This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
