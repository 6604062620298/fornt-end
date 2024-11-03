'use client'
import { InlineMath } from "react-katex";
import React, { useState } from 'react'
import 'katex/dist/katex.min.css';
import { evaluate } from "mathjs";
import dynamic from "next/dynamic"
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function page() {

    const [a, seta] = useState(-1);
    const [b, setb] = useState(2);
    const [equation, setequation] = useState('x^7+2x^3-1') 
    const [xresult, setxresult] = useState(0);
    const [grapdata, setgrapdata] = useState([]);
    const [solution, setsolution] = useState([]);

    const calculatetrapez = () => {

        const x_1 = (b + a) / 2;
        console.log(x_1);
        console.log(a);
        console.log(b);
        let I = 0
        let fx_0,fx_1,fx_2;
        fx_0 = evaluate(equation, { x: a });
        fx_1 = evaluate(equation, { x: x_1});
        fx_2 = evaluate(equation, { x: b});

        I = (b - a )/3 * (fx_0 + 4 * fx_1 + fx_2) / 2;

        const steps = [];

        steps.push(`I = \\int_{${a}}^{${b}} f(x) dx = \\int_{${a}}^{${b}} ${equation} \\ dx`)
        steps.push(`f(x0 =  ${a}) = ${equation} = ${fx_0}`);
        steps.push(`f(x1 = ${x_1}) = ${equation} = ${fx_1}`);
        steps.push(`f(x2 =  ${b}) = ${equation} = ${fx_2}`);
        steps.push(`I = h/2(f(x0) + 4f(x1) + f(x2))) = ${x_1} / 2 (${fx_0} + 4(${fx_1}) +${fx_2}) = ${I}`)

        
        setsolution(steps);
        setgrapdata(I);
        setxresult(I);
    }


    const input_a = (e) => {
        seta(parseint(e.target.value));
    }
    const inputequation = (e) => {
        setequation(e.target.value);
    }
    const input_b = (e) => {
        setb(e.target.value)
    }
    const chartdata = {
        data: [
            {
                type: "scatter",
                mode: "lines markers",
                line: {color: 'red'},
                name: 'f(x)',
            },
        ]
    }

    return (
        <>
            {/* หัวเรื่อง */}
            <header className='p-7'>
                <h1 className='text-center font-bold text-4xl p-4'>Single Simpson's Rule</h1>
            </header>

            {/* Display Equation */}
            <div className="mx-auto max-w-lg p-4">
                <div className="flex justify-center border-2 shadow-lg">
                    <div className="p-4 text-2xl w-full overflow-x-auto text-center">
                        <InlineMath math={`\\int_{${a}}^{${b}} ${equation} \\ dx`} />
                    </div>
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="flex flex-col">
                <label className="p-2"><InlineMath math="f(x)" /></label>
                    <input type="text" value={equation} onChange={inputequation} className="btn border-2 shadow-lg w-64" />
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="flex flex-col">
                    <label className="p-2"><InlineMath math="a = x0"/></label>
                    <input type="number" value={a} onChange={input_a} className="btn border-2 shadow-lg w-64" />
                </div>
            </div>

            <div className='flex justify-center'>
                <div className="flex flex-col">
                    <label className="p-2"><InlineMath math="b = x1"/></label>
                    <input type="number" value={b} onChange={input_b} className="btn border-2 shadow-lg w-64" />
                </div>
            </div>

            {/* Answer */}
            <div className="text-center m-8">
                <h5>Answer = {xresult.toPrecision(6)}</h5>
            </div>

            <div className='flex flex-col md:flex-row justify-center items-center mb-4 gap-4'>
                <div className="flex items-center gap-2">
                    <button value={xresult} onClick={calculatetrapez} className="btn border-2 shadow-lg bg-blue-600 text-white">Calculate</button>
                </div>
            </div>

            {/* Graph */}
            <div className='min-h-max flex items-center justify-center gap-3  rounded-lg p-9'>
                <div className='rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 flex justify-center gap-3 overflow-hidden'>
                    <Plot data={chartdata.data} layout={chartdata.layout} className='rounded-lg shadow-lg w-full h-auto max-w-full object-contain' config={{ scrollZoom: true }} />
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
    )
}

export default page 