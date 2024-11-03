'use client'
import axios from "axios";
import { InlineMath } from "react-katex";
import 'katex/dist/katex.min.css';
import dynamic from "next/dynamic"
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })
import { useState } from "react";
import { evaluate } from 'mathjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Page = () => {

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100; // ฟังก์ชันคำนวณ error

  const [datagraph, setdatagraph] = useState([]); // สำหรับเก็บข้อมูลกราฟ
  const [data, setData] = useState([]); // สำหรับเก็บข้อมูลตาราง
  const [Equation, setEquation] = useState('(x^6) - 13'); // สมการเริ่มต้น
  const [X_0, setX_0] = useState('5'); // ค่าจุดเริ่มต้น
  const [X_1, setX_1] = useState('10');
  const [Error, setError] = useState(0.00001); // ค่าความคลาดเคลื่อน
  const [Xresult, setXresult] = useState(0.0); // ตั้งค่า Xresult เป็น 0.0 เริ่มต้น

  const adddata = async () => {
    const datadb = {
      Solution: "Secant Method",
      Equation: Equation,
      Result: Xresult.toString()
    };

    try {
      await axios.post("http://localhost:5000/data", datadb);
    } catch (err) {
      console.log("Error posting data:", err);
    }
  };


  const Calsecant = (X_zero, X_one, Equation, errorValue) => {
    let x_0 = X_zero;
    let x_1 = X_one;
    let iteration = 0;
    let fX_0, fX_1, yk;

    const tempData = [];
    const newGraphData = [];

    do {
      iteration++;

      let scope_0 = { x: x_0 };
      let scope_1 = { x: x_1 };

      fX_0 = evaluate(Equation, scope_0);
      fX_1 = evaluate(Equation, scope_1);

      let denominator = fX_1 - fX_0;
      if (denominator === 0) {
        console.error("Division by zero error");
        break;
      }

      let x_new = x_1 - (fX_1 * (x_1 - x_0)) / denominator;
      const ea = error(x_1, x_new);

      x_0 = x_1;
      x_1 = x_new;

      let scope_x_new = { x: x_new };
      yk = evaluate(Equation, scope_x_new);

      tempData.push({ iteration, X_0: x_0, X_1: yk, X_New: x_new, error_show: ea });
      newGraphData.push({ x: x_new, y: fX_0 });

      if (ea <= errorValue) break;

    } while (Math.abs(fX_1) > errorValue);

    setData(tempData);
    setdatagraph(newGraphData);
    setXresult(x_1);
  };


  const inputEquation = (event) => {
    setEquation(event.target.value);
  };
  const inputx_0 = (event) => {
    setX_0(parseFloat(event.target.value));
  };
  const inputx_1 = (event) => {
    setX_1(parseFloat(event.target.value));
  };
  const inputerror = (event) => {
    setError(parseFloat(event.target.value));
  };
  const calculateRoot = () => {
    Calsecant(X_0, X_1, Equation, Error);
    adddata()
  };

  const chartData = {
    data: [
      {
        type: "scatter", //กราฟที่จะใช้
        mode: "lines markers", //จะจุดหรือจะเส้น
        x: datagraph.map((point) => point.x),
        y: datagraph.map((point) => point.y),
        marker: { color: 'blue' },
        line: { color: 'red' },
        name: 'f(X)',
      },
      {
        type: "scatter", //กราฟที่จะใช้
        mode: "lines markers", //จะจุดหรือจะเส้น
        x: datagraph.map((point) => point.x),
        y: datagraph.map((point) => point.y),
        marker: { color: 'red' },
        line: { color: 'blue' },
        name: "f'(X)",
      },

    ],
    layout: {
      title: "Graph",
      xaxis: {
        zeroline: true
      },
      yaxis: {
        zeroline: true
      }
    },
  };


  return (
    <>
      {/* Title */}
      <header className="p-7">
        <h1 className="text-center font-bold text-4xl p-4">Secant Method</h1>
      </header>

      {/* Display Equation */}
      <div className="mx-auto max-w-lg p-4">
        <div className="flex justify-center border-2 shadow-lg">
          <div className="p-4 text-2xl w-full overflow-x-auto text-center">
            <InlineMath math={`f(x) = ${Equation}`} />
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="p-6">
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="equation">
                Equation
              </label>
              <input type="text" id="equation" value={Equation} onChange={inputEquation} className="input input-bordered w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="xl">
                X0
              </label>
              <input type="number" id="xl" value={X_0} onChange={inputx_0} className="input input-bordered w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="xr">
                X1
              </label>
              <input type="number" id="xr" value={X_1} onChange={inputx_1} className="input input-bordered w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="xl">
                Error
              </label>
              <input type="number" id="xl" value={Error} onChange={inputerror} className="input input-bordered w-full" />
            </div>

            {/* Calculate Button */}
            <div className="flex justify-center p-4">
              <button className="btn bg-blue-500 text-white" onClick={calculateRoot}>
                Calculate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Answer */}
      <div className="flex justify-center p-2  text-gray-700 text-sm font-bold mb-2">
        <h5>Answer = {Xresult.toPrecision(7)}</h5>
      </div>

      {/* Graph */}
      <div className='min-h-max flex items-center justify-center gap-3  rounded-lg p-9'>
        <div className='rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 flex justify-center gap-3 overflow-hidden'>
          <Plot data={chartData.data} layout={chartData.layout} className='rounded-lg shadow-lg w-full h-auto max-w-full object-contain' config={{ scrollZoom: true }} />
        </div>
      </div>


      {/* Table */}
      <h1 className="block text-gray-700 text-sm font-bold mb-2">Table :</h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full border-2 shadow-lg">
          <thead>
            <tr>
              <th>Iteration</th>
              <th>X</th>
              <th>Y</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {data.map((element, index) => (
              <tr key={index}>
                <td>{element.iteration}</td>
                <td>{element.X_New.toPrecision(12)}</td>
                <td>{element.X_1.toPrecision(12)}</td>
                <td>{element.error_show.toPrecision(12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
};

export default Page;
