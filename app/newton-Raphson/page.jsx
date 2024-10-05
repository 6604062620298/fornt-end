'use client'
import { InlineMath } from "react-katex";
import 'katex/dist/katex.min.css';
import dynamic from "next/dynamic"
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })
import { useState } from "react";
import { evaluate, derivative } from 'mathjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const page = () => {

  const errorr = (f) => Math.abs((f * 100));
  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100; // ฟังก์ชันคำนวณ error

  const [datagraph, setdatagraph] = useState([]); // สำหรับเก็บข้อมูลกราฟ
  const [data, setData] = useState([]); // สำหรับเก็บข้อมูลตาราง
  const [Equation, setEquation] = useState('(x^6) - 13'); // สมการเริ่มต้น
  const [Xstart, setXstart] = useState(10); // ค่าจุดเริ่มต้น
  const [Error, setError] = useState(0.00001); // ค่าความคลาดเคลื่อน
  const [Xresult, setXresult] = useState(0.0); // ตั้งค่า Xresult เป็น 0.0 เริ่มต้น

  const Calnewton = (Xstart, Equation, errorValue) => {
    let xstart = Xstart
    let ea,er;
    let iteration = 0;
    let xnew, fX, f_prime;
    
    const tempData = [];
    const newGraphData = [];

    do {
      iteration++;
      let scope = { x: xstart };
      fX = evaluate(Equation, scope);
      f_prime = derivative(Equation, 'x').evaluate(scope);

      xnew = xstart - (fX / f_prime);
      ea = error(xstart, xnew);
      er = errorr(fX);

      tempData.push({ iteration, Xl: xstart, Xm: xnew, Xr: xnew, er:ea, f:fX, e:er }); // เก็บค่าลงในตาราง
      newGraphData.push({ x: xnew, y: 0 });
      newGraphData.push({ x: xnew, y: f_prime }); // เก็บค่าลงในกราฟ

      if (ea <= errorValue) break;

      xstart = xnew;
    } while (iteration < 50); // จำกัดจำนวนรอบไม่เกิน 50

    setData(tempData); // ตั้งค่าข้อมูลในตาราง
    setdatagraph(newGraphData); // ตั้งค่าข้อมูลสำหรับกราฟ
    setXresult(xnew); // แสดงค่าผลลัพธ์สุดท้าย
  };

  const inputEquation = (event) => {
    setEquation(event.target.value);
  };
  const inputxstart = (event) => {
    setXstart(parseFloat(event.target.value));
  };
  const inputerror = (event) => {
    setError(parseFloat(event.target.value));
  };

  const calculateRoot = () => {
    Calnewton(Xstart, Equation, Error);
  };

  const chartData = {
    data: [
      {
        type: "scatter",
        mode: "lines +markers",
        x: datagraph.map((point) => point.x),  // X จาก datagraph
        y: datagraph.map((point) => point.y),  // Y คือ f(X)
        marker: { color: 'red' },
        name : 'Marker'
    },
    {
      type: "scatter",
      mode: "linesmarkers",
      x: datagraph.map((point) => point.x),  // X จาก datagraph
      y: datagraph.map((item) => item.y),  // Y คือ f'(X)
      line: { color: 'blue' },
      name: 'Line'
  },
    ],
    layout: {
        title: "Newton Raphson",
        xaxis: {
            zeroline: true,
        },
        yaxis: {
            zeroline: true,
        },
    }
};

  return (
    <>
      {/* Title */}
      <header className="p-7">
        <h1 className="text-center font-bold text-4xl p-4">Newton Raphson</h1>
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
                Xstart
              </label>
              <input type="number" id="xl" value={Xstart} onChange={inputxstart} className="input input-bordered w-full" />
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
                    <td>{element.Xl.toPrecision(6)}</td>
                    <td>{element.f.toPrecision(6)}</td>
                    <td>{element.e.toPrecision(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </>
  )
};

export default page;
