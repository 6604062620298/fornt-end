"use client";
import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

function Page() {
  const [size, setSize] = useState(2); // Initial matrix size
  const [matrixA, setMatrixA] = useState(Array.from({ length: size }, () => Array(size).fill('')));
  const [matrixB, setMatrixB] = useState(Array(size).fill(''));
  const [resultX, setResultX] = useState(Array(size).fill(''));
  const [solutionSteps, setSolutionSteps] = useState([]); // Store solution steps for InlineMath

  useEffect(() => {
    const newMatrixA = Array.from({ length: size }, () => Array(size).fill(''));
    const newMatrixB = Array(size).fill('');
    const newResultX = Array(size).fill('');

    setMatrixA(newMatrixA);
    setMatrixB(newMatrixB);
    setResultX(newResultX);
    setSolutionSteps([]);
  }, [size]);

  const gaussianElimination = () => {
    const a = matrixA.map(row => row.map(Number)); // Convert inputs to numbers
    const b = matrixB.map(Number);
    const n = size;
    let steps = [];

    // Forward Elimination
    for (let i = 0; i < n; i++) {
      // Partial Pivoting
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(a[k][i]) > Math.abs(a[maxRow][i])) {
          maxRow = k;
        }
      }
      
      // Swap rows if necessary
      if (i !== maxRow) {
        [a[i], a[maxRow]] = [a[maxRow], a[i]];
        [b[i], b[maxRow]] = [b[maxRow], b[i]];
        steps.push(`\\text{Swapped rows } ${i + 1} \\text{ and } ${maxRow + 1}`);
      }

      // Make sure the pivot is not zero
      if (a[i][i] === 0) {
        alert("No unique solution exists.");
        return;
      }

      // Eliminate below
      for (let k = i + 1; k < n; k++) {
        const factor = a[k][i] / a[i][i];
        for (let j = i; j < n; j++) {
          a[k][j] -= factor * a[i][j];
        }
        b[k] -= factor * b[i];

        steps.push(`R_${k + 1} = R_${k + 1} - (${factor.toFixed(6)}) R_${i + 1}`);
      }
    }

    // Back Substitution
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = b[i];
      for (let j = i + 1; j < n; j++) {
        sum -= a[i][j] * x[j];
      }
      x[i] = (sum / a[i][i]).toFixed(6);

      steps.push(`x_${i + 1} = \\frac{b_${i + 1} - \\sum_{j=${i + 2}}^{n} a_{ij}x_j}{a_{ii}} = ${x[i]}`);
    }

    setResultX(x);
    setSolutionSteps(steps);
  };

  const handleInputChange = (setMatrix, matrix, rowIndex, colIndex, value) => {
    const newMatrix = [...matrix];
    if (colIndex !== null) {
      newMatrix[rowIndex][colIndex] = value;
    } else {
      newMatrix[rowIndex] = value;
    }
    setMatrix(newMatrix);
  };

  const resetMatrix = () => {
    setMatrixA(Array.from({ length: size }, () => Array(size).fill('')));
    setMatrixB(Array(size).fill(''));
    setResultX(Array(size).fill(''));
    setSolutionSteps([]);
  };

  return (
    <div className="min-h-max flex items-center justify-center p-3">
      <div className="bg-white rounded-lg p-6 md:p-14 shadow-lg w-auto max-w-full">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold"> Gaussian Elimination</h1>
        </div>

        <div className='flex justify-center'>
          <div className="mb-4 flex items-center gap-2">
            <label>Matrix size (NxN):</label>
            <input
              type="number"
              value={size}
              min="1"
              onChange={(e) => setSize(parseInt(e.target.value) || 1)}
              className="border rounded px-2 py-1 w-16"
            />
            <button onClick={resetMatrix} className="bg-red-500 text-white px-3 py-1 rounded">
              ♻️
            </button>
            <button onClick={gaussianElimination} className="bg-blue-500 text-white px-4 py-1 rounded">Calculate!</button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          {/* Matrix A */}
          <div className="flex flex-col">
            <InlineMath math="[A]" />
            {matrixA.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((value, colIndex) => (
                  <input
                    key={colIndex}
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleInputChange(setMatrixA, matrixA, rowIndex, colIndex, e.target.value)
                    }
                    className="border rounded w-12 h-12 m-1 text-center"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Matrix X */}
          <div className="flex flex-col items-center">
            <InlineMath math="{x}" />
            {resultX.map((value, rowIndex) => (
              <input
                key={rowIndex}
                type="text"
                value={value}
                readOnly
                className="border rounded w-12 h-12 m-1 text-center"
                placeholder={`x${rowIndex + 1}`}
              />
            ))}
          </div>

          {/* Equals sign */}
          <div>
            <InlineMath math="=" />
          </div>

          {/* Matrix B */}
          <div className="flex flex-col items-center">
            <InlineMath math="{B}" />
            {matrixB.map((value, rowIndex) => (
              <input
                key={rowIndex}
                type="text"
                value={value}
                onChange={(e) =>
                  handleInputChange(setMatrixB, matrixB, rowIndex, null, e.target.value)
                }
                className="border rounded w-12 h-12 m-1 text-center"
                placeholder={`b${rowIndex + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Display Solution Steps */}
        <div className="mt-4">
          {solutionSteps.map((step, index) => (
            <div key={index} className="mb-2">
              <InlineMath math={step} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
