'use client'
import { InlineMath } from "react-katex";
import 'katex/dist/katex.min.css';
import Plot from 'react-plotly.js';
import { useState } from "react";
import { evaluate } from 'mathjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Page = () => {

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100; // ฟังก์ชันคำนวณ error

  const [datagraph, setdatagraph] = useState([]); // สำหรับเก็บข้อมูลกราฟ
  const [data, setData] = useState([]); // สำหรับเก็บข้อมูลตาราง
  const [Equation, setEquation] = useState('(x^4) - 13'); // สมการเริ่มต้น
  const [X_0, setX_0] = useState('2'); // ค่าจุดเริ่มต้น
  const [Error, setError] = useState(0.00001); // ค่าความคลาดเคลื่อน
  const [Xresult, setXresult] = useState(0.0); // ตั้งค่า Xresult เป็น 0.0 เริ่มต้น

  const CalOnePoint = (X_zero, Equation, errorValue) => {
    let x_0 = X_zero;
    let iteration = 0;
    let ea = 0; // กำหนดค่าเริ่มต้นให้กับ ea
    const results = [];
    const graphData = [];
  
    do {
      iteration++;
      let scope_0 = { x: x_0 };
      let fX_0 = evaluate(Equation, scope_0); // ประเมินสมการ f(x)
      let x_new = fX_0; // คำนวณค่า x ใหม่จาก f(x)
      ea = error(x_0, x_new); // คำนวณ error
  
      console.log(`Iteration: ${iteration}, X_0: ${x_0}, X_new: ${x_new}, fX_0: ${fX_0}, Error: ${ea}`);
  
      results.push({ iteration, X_0: x_0, X_New: x_new, error_show: ea, f:fX_0 });
      graphData.push({ x: iteration, y: x_new });
  
      x_0 = x_new; // อัพเดตค่า x_0
    } while (ea > errorValue && iteration < 1000); // loop จนกว่า error จะน้อยกว่าค่าที่กำหนดหรือ iteration เกิน 1000
  
    setData(results);
    setdatagraph(graphData);
    setXresult(x_0);
  };
  const inputEquation = (event) => {
    setEquation(event.target.value);
  };
  const inputX_0 = (event) => {
    setX_0(parseFloat(event.target.value));
  };
  const inputerror = (event) => {
    setError(parseFloat(event.target.value));
  };
  const calculateRoot = () => {
    CalOnePoint(X_0, Equation, Error); // เรียกใช้ฟังก์ชันคำนวณ root
  };

  const chartData = {
    data: [
        {
            type: "scatter", //กราฟที่จะใช้
            mode: "lines markers", //จะจุดหรือจะเส้น
            x: datagraph.map((point) => point.x),
            y: datagraph.map((point) => point.y),
            marker: {color: 'blue'},
            line: {color: 'red' },
            name: 'f(X)',
        },
        {
          type: "scatter", //กราฟที่จะใช้
          mode: "lines markers", //จะจุดหรือจะเส้น
          x: datagraph.map((point) => point.x),
          y: datagraph.map((point) => point.y),
          marker: {color: 'red'},
          line: {color: 'blue' },
          name: "f'(X)",
      },
    ],
    layout: {
        title: "One Point Iteration",
        xaxis: {
            zeroline: true,
        },
        yaxis: {
            zeroline: true,
        }
    }
};

  return (
    <>
      {/* Title */}
      <header className="p-7">
        <h1 className="text-center font-bold text-4xl p-4">One Point Iteration</h1>
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
                X Initial
              </label>
              <input type="number" id="xl" value={X_0} onChange={inputX_0} className="input input-bordered w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="xr">
                Error
              </label>
              <input type="number" id="xr" value={Error} onChange={inputerror} className="input input-bordered w-full" />
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
      <div className="text-center p-2">
        <h5>Answer = {Xresult.toPrecision(7)}</h5>
      </div>

      {/* Graph */}
      {/* Graph */}
      <div className='min-h-max flex items-center justify-center gap-3  rounded-lg p-9'>
        <div className='rounded-lg shadow-lg w-full md:w-3/4 lg:w-1/2 flex justify-center gap-3 overflow-hidden'>
          <Plot data={chartData.data} layout={chartData.layout} className='rounded-lg shadow-lg w-full h-auto max-w-full object-contain'config={{ scrollZoom: true }}/>
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
                    <td>{element.Xl}</td>
                    <td>{element.f.toPrecision(6)}</td>
                    <td>{element.error_show.toPrecision(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </>
  )
};

export default Page;
