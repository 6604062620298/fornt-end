'use client'
import React, { useEffect, useState } from 'react'
import { InlineMath, BlockMath } from 'react-katex';

function page() {

    const [sizely, setsizely] = useState(4); // Cubic spline ต้องใช้ 4 จุด
    const [x, setx] = useState(Array(sizely).fill({ x: '', fx: '' }));
    const [y, sety] = useState(Array(sizely).fill({ x: '', fx: '' }));
    const [xn, setxn] = useState('2.5');
    const [xresult, setxresult] = useState(0);
    const [solution, setsolution] = useState([]);

    useEffect(() => {
        setx(Array.from({ length: sizely }, () => ({ x: '', fx: '' })));
        sety(Array.from({ length: sizely }, () => ({ x: '', fx: '' })));
    }, [sizely])

    const calculatespline = () => {
        const input_x = x.map((point) => parseFloat(point.x));
        const input_y = y.map((point) => parseFloat(point.fx));
        const n = input_x.length;
        const xnn = parseFloat(xn);
        let fxn;

        if (n < 4) {
            alert("ต้องอย่างน้อย 4 จุดนะครับ");
            return;
        }

        const steps = [];

        for (let i = 0; i < n; i++) {
            if (i > 0 && xnn >= input_x[i - 1] && xnn <= input_x[i]) {
               
                const m = (input_y[i] - input_y[i - 1]) / (input_x[i] - input_x[i - 1]);
               
                fx = input_y[i - 1] + m * (xnn - input_x[i - 1]);
                
                steps.push(`f_{${i}}(x) = f(${input_x[i - 1]}) + \\frac{f(${input_x[i]}) - f(${input_x[i - 1]})}{${input_x[i]} - ${input_x[i - 1]}}(x - ${input_x[i - 1]})`);
                steps.push(`f(${xnn}) = ${input_y[i - 1]} + \\frac{(${input_y[i]} - ${input_y[i - 1]})}{(${input_x[i]} - ${input_x[i - 1]})}(${xnn} - ${input_x[i - 1]})`);
                
                break;
            }
        }

        if (fxn !== undefined) {
            setxresult(fxn);
        } else {
            alert("ค่า X นอกช่วงของข้อมูลที่มีอยู่");
        }

        setsolution(steps);
    };


    const inputxn = (event) => {
        setxn(event.target.value);
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
    };


    return (
        <>
            <header className='p-7 flex justify-center'>
                <h1 className='text-4xl font-bold'>Cubic Spline Interpolation</h1>
            </header>

            <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
                <div className="flex items-center gap-2">
                    <button onClick={() => setsizely(sizely > 1 ? sizely - 1 : 1)} className="btn border px-9 py-1 bg-red-500 text-white m-1">-</button>
                    <label className="text-sm md:text-base">Number of points :</label>
                    <input type="number" value={sizely} onChange={handleSizeChange} className='btn border-2 shadow-lg w-20 px-4 py-1' />
                    <button onClick={() => setsizely(sizely + 1)} className="btn border-radius px-9 py-1 bg-green-500 text-white">+</button>
                </div>
            </div>

            <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
                <div className="flex items-center gap-2">
                    <label className="text-sm md:text-base">X value : </label>
                    <input type="number" value={xn} onChange={inputxn} className="btn border-2 shadow-lg" />
                </div>
            </div>

            <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
                <div className="flex items-center gap-2">
                    <button onClick={calculatespline} className="btn border-2 shadow-lg bg-blue-600 text-white">Calculate</button>
                </div>
            </div>

            <div className="text-center p-2">
                <h5>Answer = {xresult.toPrecision(4)}</h5>
            </div>

            <div className='flex justify-center border-2 shadow-lg m-6 p-3'>
                <div>
                    {x.map((point, index) => (
                        <div key={index} className='p-1'>
                            <label className="text-sm md:text-base p-1">{index + 1}.</label>
                            <input type="text" value={point.x} onChange={(e) => InputChange_x(index, 'x', e.target.value)} placeholder={`x${index + 1}`} className='btn border-2 shadow-lg w-36' />
                        </div>
                    ))}
                </div>
                <div>
                    {y.map((point, index) => (
                        <div key={index} className='p-1'>
                            <input type="text" value={point.fx} onChange={(e) => InputChange_y(index, 'fx', e.target.value)} placeholder={`f(x${index + 1})`} className='btn border-2 shadow-lg w-36' />
                        </div>
                    ))}
                </div>
            </div>

            <div className='border-2 shadow-lg m-6 p-8'>
                <h1 className='block text-gray-700 text-sm font-bold mb-2'>Solution :</h1>
                <div className="mt-4 overflow-x-auto flex justify-center">
                    <div className="flex flex-col items-center">
                        {solution.map((step, index) => (
                            <div key={index} className="mb-2 text-sm md:text-base">
                                <BlockMath math={step} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}

export default page;
