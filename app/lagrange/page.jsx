'use client'
import { index, leftShift } from 'mathjs';
import React, { useEffect, useState } from 'react'

function page() {

    const [sizely, setsizely] = useState(3);
    const [x, setx] = useState(Array(sizely).fill({ x: '', fx: '' }));
    const [y, sety] = useState(Array(sizely).fill({ x: '', fx: '' }));
    const [x_value, setx_value] = useState('');
    const [xresult, setxresult] = useState(0);

    useEffect(() => {
        setx(Array.from({ length: sizely }, () => ({ x: '', fx: '' })));
        sety(Array.from({ length: sizely }, () => ({ x: '', fx: '' })));
    }, [sizely]);

    const calculatela = () => {
        const x_input = x.map((point) => parseFloat(point.x));
        const y_input = y.map((point) => parseFloat(point.fx));
        const n = x_input.length;
        let L = Array(sizely).fill(0);
        let res_up;
        let res_down;
        let res = 0;

        if (n < 2) {
            alert("ต้องอย่างน้อย 2 จุดนะครับ")
            return;
        }

        for(let i = 0; i < n; i++){
            res_up = 1; 
            res_down = 1;

            for(let j = 0; j < n; j++){
                if(j != i){
                    res_up *= x_input[j] - x_value;
                }
            }
            for(let j = 0; j < n; j++){
                if(j != i){
                    res_down *= x_input[j] - x_input[i];
                }
            }
            L[i] = res_up / res_down;
        }

        for(let i = 0; i < n; i++){
             res += L[i] * y_input[i];
        }

        if (res !== undefined) {
            setxresult(res);
        } else {
            alert("ค่า X นอกช่วงของข้อมูลที่มีอยู่");
        }
    }

    const inputx_value = (e) => {
        setx_value(e.target.value);
    }

    const input_size = (e) => {
        const value = parseInt(e.target.value);
        if(value > 0){
            setsizely(value);
        }
    }
    const InputChange_x = (index, field, value) => {
        const update_x = [...x];
        update_x[index][field] = value;
        setx(update_x);
    }
    const InputChange_y = (index, field, value) => {
        const update_y = [...y];
        update_y[index][field] = value;
        sety(update_y);
    }


    return (
        <>
            <header className='p-7 flex justify-center'>
                <h1 className='text-4xl font-bold'>Lagrange Interpolation</h1>
            </header>

            <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
                <div className="flex items-center gap-2">
                    <button onClick={() => setsizely(sizely > 1 ? sizely - 1 : 1)} className="btn border px-9 py-1 bg-red-500 text-white m-1">-</button>
                    <label className="text-sm md:text-base">Number of points :</label>
                    <input type="number" value={sizely} onChange={input_size} className='btn border-2 shadow-lg w-20 px-4 py-1' />
                    <button onClick={() => setsizely(sizely + 1)} className="btn border-radius px-9 py-1 bg-green-500 text-white">+</button>
                </div>
            </div>

            <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
                <div className="flex items-center gap-2">
                    <label className="text-sm md:text-base">X value : </label>
                    <input type="number" value={x_value} onChange={inputx_value} placeholder='0.00' className="btn border-2 shadow-lg" />
                </div>
            </div>

            <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
                <div className="flex items-center gap-2">
                    <button onClick={calculatela} className="btn border-2 shadow-lg bg-blue-600 text-white">Calculate</button>
                </div>
            </div>

            <div className="text-center p-2">
            <h5>Answer = {xresult.toPrecision(3)}</h5>
            </div>

            <div className='flex justify-center border-2 shadow-lg m-6 p-3'>
                <div>
                    {x.map((point, index) => (
                        <div key={index} className='p-1'>
                            <label className="text-sm md:text-base p-1">{index + 1}.</label>
                            <input type="text" value={point.x} onChange={(e) => InputChange_x(index, 'x', e.target.value)} placeholder={`x${index + 1}`} className='btn border-2 shadow-lg w-36'/>
                        </div>
                    ))}
                </div>
                <div>
                    {y.map((point, index) => (
                        <div key={index} className='p-1'>
                            <input type="text" value={point.fx} onChange={(e) => InputChange_y(index, 'fx', e.target.value)} placeholder={`f(x${index + 1})`} className='btn border-2 shadow-lg w-36'/>
                        </div>
                    ))}
                </div>
            </div>

            <div className='border-2 shadow-lg m-6 p-8'>
                <h1 className='block text-gray-700 text-sm font-bold mb-2'>Solution :</h1>
                <div className="mt-4 overflow-x-auto flex justify-center">
                    <div className="flex flex-col items-center">
                        {/* {solution.map((step, index) => (
                            <div key={index} className="mb-2 text-sm md:text-base">
                                <BlockMath math={step} />
                            </div>
                        ))} */}
                    </div>
                </div>
            </div>

        </>
    )
}

export default page