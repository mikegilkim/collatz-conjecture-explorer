# Collatz Conjecture Explorer

A sleek, interactive React app for exploring the Collatz Conjecture through animated sequences, responsive charts, comparative analysis, and export tools.

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646cff" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38bdf8" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Chart.js-4-ff6384" alt="Chart.js 4" />
</p>

## ✨ What it does

This app lets you:

- enter any positive integer and generate its Collatz sequence
- watch the sequence animate step by step
- pause, resume, and reset the animation
- view sequence statistics like steps, max value, and average step size
- inspect growth, odd/even step counts, and the longest even streak
- explore the sequence through a responsive line/bar chart
- compare custom starting values on the same chart
- analyze a range of starting values and graph steps to reach 1
- read a step-by-step explanation of the applied rule
- save favorite starting values in the browser
- test your prediction with challenge mode
- export the sequence or chart as CSV, JSON, PNG, or SVG
- copy a shareable link for the current run
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
- dedicated analysis cards for individual runs and ranges
- persistent browser favorites using local storage

## 🛠️ Tech stack

- React
- Vite
- Tailwind CSS via the browser build
- Chart.js 4
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

### Preview the production build

```bash
npm run preview
```

## 🌐 Live demo

The current production deployment is available at:

https://collatz-conjecture-explorer-eta.vercel.app

## 📦 Features overview

### Sequence controls

- Run a new sequence from a chosen starting number
- Pause and resume the reveal animation
- Reset the application to a clean Ready state
- Adjust animation speed with a live slider

### Visualization

- line chart and bar chart modes
- hover tooltips for step/value details
- comparison overlay for up to four runs
- responsive layout for desktop and mobile screens

### Analysis and learning

- growth multiplier, odd-step count, even-step count, and longest even streak
- batch range analysis with a steps-to-1 bar chart
- optional step-by-step rule explanations
- challenge mode for guessing the number of steps before revealing the answer
- favorite starting values stored locally in the browser

### Export options

- CSV export
- JSON export
- PNG chart export
- SVG chart export
- shareable link copied to the clipboard

## 📁 Project structure

```bash
src/
  App.jsx
  App.css
  index.css
  main.jsx
public/
  favicon.svg
  og-image.svg
  site.webmanifest
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
- Live demo: https://collatz-conjecture-explorer-eta.vercel.app
