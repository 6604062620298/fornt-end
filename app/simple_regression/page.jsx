"use client";
import { InlineMath, BlockMath } from 'react-katex';
import dynamic from "next/dynamic";
import React, { useEffect, useState } from 'react';
import { matrix } from 'mathjs';
import { det } from 'mathjs';
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

function Page() {

  const [sizely, setsizely] = useState(1);
  const [x, setx] = useState(Array(sizely).fill({ x: '', fx: '' }));
  const [y, sety] = useState(Array(sizely).fill({ x: '', fx: '' }));
  const [m_order, setm_order] = useState("1");
  const [x_value, setx_value] = useState("0");
  const [solution, setsolution] = useState([]);
  const [xresult, setxresult] = useState(Array(sizely).fill(''));

  useEffect(() => {
    setx(Array.from({ length: sizely }, () => ({ x: '', fx: '' })));
    sety(Array.from({ length: sizely }, () => ({ x: '', fx: '' })));
  }, [sizely]);

  const calcarmer = (m) => {
    const X = x.map(point => Number(point.x));  // ใช้ x ที่รับค่าจาก input
    const Y = y.map(point => Number(point.fx));  // ใช้ y ที่รับค่าจาก input

    let matrixA = Array(m + 1).fill(0).map(() => Array(m + 1).fill(0));  // ประกาศ matrix A
    let vectorB = Array(m + 1).fill(0);  // ประกาศ vector B
    let xx = [];

    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= m; j++) {
        matrixA[i][j] = X.reduce((sum, x) => sum + Math.pow(x, i + j), 0);  // คำนวณ matrix A
      }
      vectorB[i] = X.reduce((sum, x, index) => sum + Y[index] * Math.pow(x, i), 0);  // คำนวณ vector B
    }

    let detA = det(matrixA);

    for (let i = 0; i <= m; i++) {
      const matrixx = matrixA.map((row, rowindex) => {
        const newrow = [...row];
        newrow[i] = vectorB[rowindex];
        return newrow;
      });
      const detai = det(matrixx);
      xx[i] = (detai / detA);  // คำนวณค่าแต่ละค่าใน vector ผลลัพธ์
    }

    return xx;
  }

  const calculatesim_re = () => {
    let sum = 0;
    let a = calcarmer(parseInt(m_order));

    for (let i = 0; i <= m_order; i++) {
      sum += a[i] * Math.pow(x_value, i);
    }
    setsolution([sum]);  // แก้ไข: setr เป็น setsolution
  }

  const handleSizeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setsizely(value);
    }
  };

  const InputChange_x = (index, field, value) => {
    const update_x = [...x];
    update_x[index][field] = value;
    setx(update_x);
  };

  const InputChange_y = (index, field, value) => {
    const update_y = [...y];
    update_y[index][field] = value;
    sety(update_y);
  }

  const Inputm_order = (event) => {
    setm_order(parseInt(event.target.value));
  }

  const Inputx_value = (event) => {
    setx_value(parseFloat(event.target.value));
  }

  const chartData = {
    data: [
      {
        x: x.map(point => parseFloat(point.x)),
        y: y.map(point => parseFloat(point.fx)),
        mode: 'lines+markers',
        type: 'scatter',
      },
    ],
    layout: {},
  }

  return (
    <>
      <header className='p-7'>
        <h1 className='text-center font-bold text-4xl p-4'>Simple Regression Extrapolation</h1>
      </header>

      <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
        <div className="flex items-center gap-2">
          <button onClick={() => setsizely(sizely > 1 ? sizely - 1 : 1)} className="btn border px-9 py-1 bg-red-500 text-white m-1">-</button>
          <label className="text-sm md:text-base">Number of points :</label>
          <input type="number" value={sizely} onChange={handleSizeChange} className='btn border-2 shadow-lg w-16 px-4 py-1' />
          <button onClick={() => setsizely(sizely + 1)} className="btn border-radius px-9 py-1 bg-green-500 text-white">+</button>
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
        <div className="flex items-center gap-2">
          <label className="text-sm md:text-base">m order : </label>
          <input type="number" value={m_order} onChange={Inputm_order} className="btn border-2 shadow-lg" />
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
        <div className="flex items-center gap-2">
          <label className="text-sm md:text-base">X value : </label>
          <input type="number" value={x_value} onChange={Inputx_value} className="btn border-2 shadow-lg" />
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
        <div className="flex items-center gap-2">
          <button onClick={calculatesim_re} className="btn border-2 shadow-lg bg-blue-600 text-white">Calculate</button>
        </div>
      </div>

      <div className='flex justify-center border-2 shadow-lg m-6 p-3'>
        <div>
          {x.map((point, index) => (
            <div key={index} className='flex gap-4 mx-10 my-5'>
              <label className="text-sm md:text-base">{index + 1}.</label>
              <input type="text" value={point.x} onChange={(e) => InputChange_x(index, 'x', e.target.value)} placeholder={`x${index + 1}`} className='btn border px-2 py-1 w-20' />
            </div>
          ))}
        </div>
        <div>
          {y.map((point, index) => (
            <div key={index} className='flex gap-4 mx-10 my-5'>
              <input type="text" value={point.fx} onChange={(e) => InputChange_y(index, 'fx', e.target.value)} placeholder={`f(x${index + 1})`} className='btn border px-2 py-1 w-20' />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center p-2">
            <h5>Answer = {solution}</h5>
            </div>

      <div className='min-h-max flex items-center justify-center gap-3 rounded-lg p-9'>
        <div className='rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 flex justify-center gap-3 overflow-hidden'>
          <Plot data={chartData.data} layout={chartData.layout} className='rounded-lg shadow-lg w-full h-auto max-w-full object-contain' config={{ scrollZoom: true }} />
        </div>
      </div>

      <div className='border-2 shadow-lg m-6 p-8'>
        <h1 className='block text-gray-700 text-sm font-bold mb-2'>Solution :</h1>
        <div className="mt-4 overflow-x-auto flex justify-center">
          <div className="flex flex-col items-center">
            {solution.map((step, index) => (
              <div key={index} className="mb-2 text-sm md:text-base">
                <InlineMath math={step} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
