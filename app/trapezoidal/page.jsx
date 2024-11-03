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

    const [a, seta] = useState(0);
    const [b, setb] = useState(2);
    const [equation, setequation] = useState('4x^5-3x^4+x^3-6x+2') 
    const [xresult, setxresult] = useState(0);
    const [grapdata, setgrapdata] = useState([]);
    const [solution, setsolution] = useState([]);

    const adddata = async () => {
        const datadb = {
         Solution: "Single Trapezoidal Rule",
         Equation: equation, 
         a: a,
         b: b,
         n: NuN,
         Result: Xresult.toString()  
       };
   
       try {
         await axios.post("http://localhost:5000/data", datadb);
       } catch (err) {
         console.log("Error posting data:", err); 
       }
     };

    const calculatetrapez = () => {
        const x_0 = a;
        const x_1 = b;
        let I = 0
        let fx_0, fx_1;
        fx_0 = evaluate(equation, { x: x_0 });
        fx_1 = evaluate(equation, { x: x_1 });
        I = (x_1 - x_0) * (fx_0 + fx_1) / 2;
        const steps = [];
        
        const points = [];
        const numPoints = 50; // จำนวนจุดที่จะคำนวณและแสดงในกราฟ
        const step = (x_1 - x_0) / numPoints;

        for (let i = 0; i <= numPoints; i++) {
            const x = x_0 + i * step;
            const y = evaluate(equation, { x });
            points.push({ x, y });  // เก็บค่า x และ y ลงใน array
        }

        points.push({b:b,x1:I})

        setgrapdata(points);


        steps.push(`I = \\int_{${a}}^{${b}} f(x) dx = \\int_{${a}}^{${b}} ${equation} \\ dx`)
        steps.push(`x0 = a = ${x_0}; f(x0) = ${equation} = ${fx_0}`);
        steps.push(`x1 = b = ${x_1}; f(x1) = ${equation} = ${fx_1}`);
        steps.push(`I = h/2[f(x0) + f(x1)]= ${b}-(${a}) / ${b} (${fx_0} + ${fx_1}) = ${I}`)


        setsolution(steps);
        setxresult(I);
        adddata()
    }


    const input_a = (e) => {
        seta(parseFloat(e.target.value));
    }
    const inputequation = (e) => {
        setequation(e.target.value);
    }
    const input_b = (e) => {
        setb(e.target.value)
    }

    const chartdata = {
        data: [
            // Plot for the actual function f(x)
            {
                type: "scatter",
                mode: "lines",
                line: { color: 'blue' },
                x: grapdata.map(p => p.x),  // Using x values from grapdata
                y: grapdata.map(p => p.y),  // Using y values from grapdata
                name: 'f(x)',
            },
            // Trapezoid area (fill between the curve and x-axis)
            {
                type: "scatter",
                mode: "lines",
                fill: 'tozeroy',
                fillcolor: 'rgba(0, 255, 0, 0.2)',  
                line: { color: 'rgba(0, 0, 0, 0)' }, 
                x: [a, b],  
                y: [evaluate(equation, { x: a }), evaluate(equation, { x: b })], 
                name: 'Trapezoid',
            },
            {
                type: "scatter",
                mode: "lines",
                line: { color: 'black', dash: 'dash' },
                x: [a, b],
                y: [evaluate(equation, { x: a }), evaluate(equation, { x: b })], 
                name: 'Trapezoidal Approximation',
            },
        ],
        layout: {
            title: 'Trapezoidal Rule',
            xaxis: { title: 'x' },
            yaxis: { title: 'f(x)' },
            showlegend: true
        }
    };
    
    
    return (
        <>
            {/* หัวเรื่อง */}
            <header className='p-7'>
                <h1 className='text-center font-bold text-4xl p-4'>Single Trapezoidal Rule</h1>
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
                    <button value={xresult} onClick={calculatetrapez } className="btn border-2 shadow-lg bg-blue-600 text-white">Calculate</button>
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