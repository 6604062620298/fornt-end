"use client";
import { matrix, det } from "mathjs";
import React, { useState, useEffect } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function Page() {
  const [size, setSize] = useState("");
  const [xValue, setXValue] = useState("");
  const [mOrder, setMOrder] = useState("");
  const [vectorX, setVectorX] = useState([]);
  const [vectorY, setVectorY] = useState([]);
  const [result, setResult] = useState("");

  const inputSize = (event) => {
    const newSize = parseInt(event.target.value);
    if (newSize < 0) {
      return;
    }
    setSize(newSize);
  };

  const inputXValue = (event) => {
    setXValue(event.target.value);
  };

  const inputMOrder = (event) => {
    setMOrder(event.target.value);
  };

  useEffect(() => {
    setVectorX(Array(size).fill(""));
    setVectorY(Array(size).fill(""));
  }, [size]);

  const handleInputChange = (setVector, vector, rowIndex, value) => {
    const newVector = [...vector];
    newVector[rowIndex] = value;
    setVector(newVector);
  };

  const generateMatrix = (m) => {
    const X = vectorX.map(Number);
    const Y = vectorY.map(Number);
    let matrix = Array(m + 1).fill(0).map(() => Array(m + 1).fill(0));
    let vectorB = Array(m + 1).fill(0);
    let xx = [];

    // Calculate values in the matrix and vector
    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= m; j++) {
        matrix[i][j] = X.reduce((sum, x) => sum + Math.pow(x, i + j), 0);
      }
      vectorB[i] = X.reduce((sum, x, index) => sum + Y[index] * Math.pow(x, i), 0);
    }

    // Calculate determinant of matrix A
    let detA = det(matrix);
    for (let i = 0; i <= m; i++) {
      const modifiedMatrix = matrix.map((row, rowIndex) => {
        const newRow = [...row];
        newRow[i] = vectorB[rowIndex]; // Replace column i
        return newRow;
      });

      const detAi = det(modifiedMatrix);
      xx[i] = detAi / detA;
    }

    return xx;
  };

  const calRegression = () => {
    const m = parseInt(mOrder);
    const x = parseFloat(xValue);
    let sum = 0;
    let a = generateMatrix(m);

    for (let i = 0; i <= m; i++) { // Change < to <= to include all orders
      sum += a[i] * Math.pow(x, i);
    }

    setResult(sum);
  };

  return (
    <>
      <div className='flex justify-center'>
        <div className='grid gap-4'>
          <input
            type='number'
            value={size}
            onChange={inputSize}
            placeholder='Number of points'
            className='input input-primary'
          />
          <input
            type='text'
            value={xValue}
            onChange={inputXValue}
            placeholder='X value'
            className='input input-primary'
          />
          <input
            type='text'
            value={mOrder}
            onChange={inputMOrder}
            placeholder='M Order'
            className='input input-primary'
          />
          <div className="flex">
            <div className="grid">
              {vectorX.map((value, rowIndex) => (
                <input
                  type="text"
                  key={rowIndex}
                  value={value}
                  onChange={(e) => handleInputChange(setVectorX, vectorX, rowIndex, e.target.value)}
                  className="input input-primary w-16"
                  placeholder={`x${rowIndex}`}
                />
              ))}
            </div>
            <div className="grid">
              {vectorY.map((value, rowIndex) => (
                <input
                  type="text"
                  key={rowIndex}
                  value={value}
                  onChange={(e) => handleInputChange(setVectorY, vectorY, rowIndex, e.target.value)}
                  className="input input-primary w-16"
                  placeholder={`y${rowIndex}`}
                />
              ))}
            </div>
            <button className="btn btn-primary" onClick={calRegression}>Calculate</button>
          </div>
          <InlineMath math={`Result : ${result}`}/>
        </div>
      </div>
    </>
  );
}

export default Page;
