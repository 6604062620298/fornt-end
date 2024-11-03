'use client'
import { BlockMath, InlineMath } from "react-katex";
import React, { useState } from 'react'
import 'katex/dist/katex.min.css';
import { evaluate } from "mathjs";
import dynamic from "next/dynamic"
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function page() {
    const [a, seta] = useState(0);
    const [b, setb] = useState(2);
    const [n, setn] = useState(4);
    const [fx, setfx] = useState('4x^5-3x^4+x^3-6x+2');
    const [result, setresult] = useState();
    const [solution, setsolution] = useState([]);
    const [Here, setHere] = useState([]);

    const calculatecom = () => {

        let h = (b - a) / n;
        let xvalue = [];
        let fvalue = [];
        let summ = 0;
        let steps =[];
        let stepss =[]

        steps.push(`I = \\int_{${a}}^{${b}} f(x) dx = \\int_{${a}}^{${b}} ${fx} dx`)
        
        xvalue.push(a);
        fvalue.push(evaluate(fx, { x: a }));

        stepss.push(`f(x${0}=${xvalue[0]}) = ${fx} = ${fvalue[0]}`);
        steps.push(`h = b - a / n = ${b} - ${a} / ${n} = ${h}`);

        for (let i = 1; i < n; i++) {
            let x_i = a + i * h;
            xvalue.push(x_i);
            let f_value = evaluate(fx, { x: x_i });
            fvalue.push(f_value);
            summ += f_value;
            stepss.push(`f(x${i}=${xvalue[i]}) = ${fx} = ${fvalue[i]}`);
        }

        let f_b = evaluate(fx, { x: b });
        fvalue.push(f_b);
        xvalue.push(b);

        stepss.push(`f(x${n}=${b}) = ${fx} = ${fvalue[n]}`);

        let i = (h / 2) * (fvalue[0] + fvalue[n] + 2 * summ);

        stepss.push(`I = h/2 (f(x${xvalue[0]}) + f(x${n}) + ∑f(xi​))`)
        stepss.push(`I = ${h} / ${b} (${fvalue[0]} + ${fvalue[n]} + 2 (${summ}))`)
        stepss.push(`I = ${i}`);

        setHere(stepss);
        setresult(i);
        setsolution(steps);
    }

    const input_n = (e) => {
        setn(parseFloat(e.target.value));
    }
    const input_a = (e) => {
        seta(parseFloat(e.target.value));
    }
    const input_b = (e) => {
        setb(parseFloat(e.target.value));
    }
    const input_fx = (e) => {
        setfx(e.target.value);
    }


    return (
        <>
            <header className='p-7'>
                <h1 className='text-center font-bold text-4xl p-4'>Composite Trapezoidal Rule</h1>
            </header>

            {/* Display Equation */}
            <div className="mx-auto max-w-lg p-4">
                <div className="flex justify-center border-2 shadow-lg">
                    <div className="p-4 text-2xl w-full overflow-x-auto text-center">
                        <InlineMath math={`\\int_{${a}}^{${b}} ${fx} \\ dx`} />
                    </div>
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="flex flex-col">
                    <label className="p-2"><InlineMath math="f(x) " /></label>
                    <input type="text" value={fx} onChange={input_fx} className="btn border-2 shadow-lg w-64" />
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="flex flex-col">
                    <label className="p-2"><InlineMath math="a = x0" /></label>
                    <input type="number" value={a} onChange={input_a} className="btn border-2 shadow-lg w-64" />
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="flex flex-col">
                    <label className="p-2"><InlineMath math="b = x1" /></label>
                    <input type="number" value={b} onChange={input_b} className="btn border-2 shadow-lg w-64" />
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="flex flex-col">
                    <label className="p-2"><InlineMath math="n" /></label>
                    <input type="number" value={n} onChange={input_n} className="btn border-2 shadow-lg w-64" />
                </div>
            </div>

            {/* Answer */}
            <div className="text-center m-8">
                <h5>Answer = {result}</h5>
            </div>

            <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
                <div className="flex items-center gap-2">
                    <button value={result} onClick={calculatecom} className="btn border-2 shadow-lg bg-blue-600 text-white">Calculate</button>
                </div>
            </div>

            <div className='border-2 shadow-lg m-6 p-8'>
                <h1 className='block text-gray-700 text-sm font-bold mb-2'>Solution :</h1>
                <div className="mt-4 overflow-x-auto flex justify-center">
                    <div className="flex flex-col items-center">
                        {solution.map((step, index) => (
                            <div key={index} className="mb-2 text-sm md:text-base">
                                <BlockMath math={step}/>
                            </div>
                        ))}
                        {Here.map((step, index) => (
                            <div key={index} className="mb-2 text-sm md:text-base p-2">
                                <InlineMath math={step} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default page