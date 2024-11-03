"use client";
import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

function Page() {
  const [size, setSize] = useState(2); // Initial matrix size
  const [matrixA, setMatrixA] = useState(Array.from({ length: size }, () => Array(size).fill('')));
  const [matrixB, setMatrixB] = useState(Array(size).fill(''));
  const [resultX, setResultX] = useState(Array(size).fill(''));
  const [epsilon, setEpsilon] = useState(0.000001);
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

  // Helper function to create a deep copy of a 2D array
  const cloneMatrix = (matrix) => matrix.map((row) => [...row]);

  const calculateGaussJordan = () => {
    let augmentedMatrix = matrixA.map((row, i) => [...row, parseFloat(matrixB[i])]);
    let steps = [];
    
    // Add the initial augmented matrix to the steps
    steps.push('Initial Augmented Matrix:');
    steps.push(formatMatrixForLatex(augmentedMatrix));

    // Gaussian-Jordan elimination
    for (let i = 0; i < size; i++) {
      // Make the diagonal element 1
      const diagElement = augmentedMatrix[i][i];
      if (Math.abs(diagElement) < epsilon) {
        alert("Matrix is singular or nearly singular.");
        return;
      }

      for (let j = 0; j <= size; j++) {
        augmentedMatrix[i][j] /= diagElement;
      } 

      steps.push(`Make row ${i + 1} diagonal element 1:`);
      steps.push(formatMatrixForLatex(augmentedMatrix));

      // Make other rows' column i elements 0
      for (let k = 0; k < size; k++) {
        if (k !== i) {
          const factor = augmentedMatrix[k][i];
          for (let j = 0; j <= size; j++) {
            augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
          }
          steps.push(`Make column ${i + 1}, row ${k + 1} element 0:`);
          steps.push(formatMatrixForLatex(augmentedMatrix));
        }
      }
    }

    const solution = augmentedMatrix.map(row => row[size].toFixed(6));
    setResultX(solution);
    setSolutionSteps(steps);
  };

  const formatMatrixForLatex = (matrix) => {
    return `\\begin{pmatrix} ${matrix.map(row => row.map(el => el.toFixed(6)).join(' & ')).join(' \\\\ ')} \\end{pmatrix}`;
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
    setEpsilon(0.000001);
    setSolutionSteps([]);
  };

  return (
    <div>
      <div className='p-7'>
        <h1 className="text-center font-bold text-4xl p-4">Gaussian-Jordan</h1>
      </div>

      <div className='m-4 md:mx-9'>
        <div className="bg-white rounded-lg w-auto max-w-full">
          <div className="text-center mb-4"></div>

          {/* size */}
          <div className='flex justify-center'>
            <div className="flex flex-col">
              <label className="p-2">[A]</label>
              <input type="number" value={size} min="1" onChange={(e) => setSize(parseInt(e.target.value) || 1)} className="btn border shadow-lg px-2 py-1 w-64" />
            </div>
          </div>

          {/* error */}
          <div className="flex justify-center">
            <div className='flex flex-col'>
              <label className="p-2">Error</label>
              <input type="number" value={epsilon} step="0.000001" onChange={(e) => setEpsilon(parseFloat(e.target.value) || 0.000001)} className="btn border shadow-lg px-2 py-1 w-64" />
            </div>
          </div>

          {/* all matrix */}
          <div className="flex flex-col md:flex-row justify-center gap-4">

            {/* A */}
            <div className="flex flex-col items-center py-10">
              <label htmlFor="">[A]</label>
              {matrixA.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-wrap justify-center">
                  {row.map((value, colIndex) => (
                    <input key={colIndex} type="text" value={value} onChange={(e) => handleInputChange(setMatrixA, matrixA, rowIndex, colIndex, e.target.value)} className="btn border rounded w-12 h-12 m-1 text-center" />
                  ))}
                </div>
              ))}
            </div>

            {/* X */}
            <div className="flex flex-col items-center p-10">
              <label htmlFor="">[x]</label>
              {resultX.map((value, rowIndex) => (
                <input key={rowIndex} type="text" value={value} readOnly className="btn border rounded w-12 h-12 m-1 text-center" placeholder={`x${rowIndex + 1}`} />
              ))}
            </div>

            {/* = */}
            <div className="flex items-center">
              <InlineMath math="=" />
            </div>

            {/* B */}
            <div className="flex flex-col items-center p-10">
              <label htmlFor="">[B]</label>
              {matrixB.map((value, rowIndex) => (
                <input key={rowIndex} type="text" value={value} onChange={(e) => handleInputChange(setMatrixB, matrixB, rowIndex, null, e.target.value)} className="btn border rounded w-12 h-12 m-1 text-center" placeholder={`b${rowIndex + 1}`} />
              ))}
            </div>
          </div>

          {/* calculate */}
          <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
            <div className="flex items-center gap-2">
              <button onClick={resetMatrix} className="btn border-2 shadow-lg bg-lime-500 text-white">Delete All</button>
            </div>
          </div>

          <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
            <div className="flex items-center gap-2">
              <button onClick={calculateGaussJordan} className="btn border-2 shadow-lg bg-blue-600 text-white">Calculate</button>
            </div>
          </div>
        </div>

        {/* Display Solution Steps */}
        <div className='my-11 border-2 shadow-lg p-4 md:p-14'>
          <h1 className='block text-gray-700 text-sm font-bold mb-2'>Solution :</h1>
          <div className="mt-4 overflow-x-auto flex justify-center">
            <div className="flex flex-col items-center">
              {solutionSteps.map((step, index) => (
                <div key={index} className="mb-2 text-sm md:text-base">
                  <InlineMath math={step} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
