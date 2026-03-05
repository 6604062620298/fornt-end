# Numerical Methods - Frontend 📐🧮

This is the frontend application for the **Numerical Methods** project, built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/). It provides an interactive, web-based interface for solving complex mathematical problems using various numerical analysis algorithms.

## ✨ Features

The application supports a wide range of mathematical methods, complete with step-by-step solutions, dynamic equations rendering (LaTeX/KaTeX), and interactive graphing (Plotly.js / Chart.js).

### 1. Root of Equations
- Graphical Method
- Bisection Method
- False Position
- One Point Iterations
- Newton-Raphson
- Secant Method

### 2. Linear Algebraic Equations
- Cramer's Rule
- Gauss Elimination
- Gauss Jordan
- Conjugate Gradient (and more)

### 3. Interpolation
- Newton's Divided Difference
- Lagrange Interpolation
- Spline Interpolation (Linear, Quadratic, Cubic)

### 4. Extrapolation / Curve Fitting
- Simple Regression
- Multiple Regression

### 5. Integration
- Single & Composite Trapezoidal Rule
- Single & Composite Simpson's Rule

## 🚀 Tech Stack

- **Framework:** Next.js 14, React 18
- **Styling:** Tailwind CSS, daisyUI
- **Math & Equations:** `mathjs`, `react-katex` (KaTeX)
- **Data Visualization:** `react-plotly.js` (Plotly), `react-chartjs-2` (Chart.js)
- **HTTP Client:** `axios` (for fetching calculation history from the backend)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ installed on your machine.
- *Optional:* The accompanying backend server running to track calculation history.

### Installation

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd fornt-end
