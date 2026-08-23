# Collatz Conjecture Explorer

A sleek, interactive React app for visualizing the Collatz Conjecture sequence with animated step-by-step reveals, responsive charts, and export tools.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646cff" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38bdf8" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Chart.js-3-ff6384" alt="Chart.js" />
</p>

## ✨ What it does

This app lets you:

- enter any positive integer and generate its Collatz sequence
- watch the sequence animate step by step
- pause, resume, and reset the animation
- view sequence statistics like steps, max value, and average step size
- explore the sequence through a responsive line/bar chart
- compare multiple runs on the same chart
- export the sequence as CSV or JSON
- share a snapshot link of the current run
- switch between dark and light themes

## 🧠 The Collatz Conjecture

The Collatz Conjecture is a deceptively simple mathematical process:

- if a number is even, divide it by 2
- if it is odd, multiply it by 3 and add 1
- repeat the process

For every number tested so far, the sequence eventually reaches the repeating loop:

4 → 2 → 1

Despite its simplicity, the conjecture remains unproven for all positive integers.

## 🖥️ Screenshots

The interface is designed to be minimal, modern, and informative, with:

- a refined dark/light card-based UI
- gradient accents in purple and blue
- a responsive chart area
- pill-style sequence badges
- an educational side panel describing the math and history

## 🛠️ Tech stack

- React
- Vite
- Tailwind CSS
- Chart.js
- react-chartjs-2
- Blob-based export utilities

## 🚀 Getting started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev -- --host 0.0.0.0
```

Then open the local URL shown in the terminal, usually:

```bash
http://localhost:5173/
```

### Build for production

```bash
npm run build
```

## 📦 Features overview

### Sequence controls

- Run a new sequence from a chosen starting number
- Pause and resume the reveal animation
- Reset the application to a clean Ready state
- Adjust animation speed with a live slider

### Visualization

- line chart and bar chart modes
- hover tooltips for step/value details
- comparison overlay for multiple runs
- responsive layout for desktop and mobile screens

### Export options

- CSV export
- JSON export
- shareable snapshot link copied to clipboard

## 📁 Project structure

```bash
src/
  App.jsx
  App.css
  index.css
  main.jsx
index.html
package.json
README.md
```

## 🤝 Contributing

Contributions are welcome. If you have ideas for improvements, feel free to open an issue or submit a pull request.

## 📜 License

This project is open source and available under the MIT license.

## 🔗 Project link

- GitHub: https://github.com/mikegilkim/collatz-conjecture-explorer
