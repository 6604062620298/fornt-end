'use client'
import axios from "axios";
import { InlineMath } from "react-katex";
import 'katex/dist/katex.min.css';
import dynamic from "next/dynamic"
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })
import { useState } from "react"
import { evaluate } from 'mathjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const page = () => {

  const error = (xold, xnew) => Math.abs((xnew - xold) / xnew) * 100;

  const [data, setData] = useState([]);
  const [datagraph, setdatagraph] = useState([]);
  const [Equation, setEquation] = useState("(x^4)-13");
  const [Xresult, setXresult] = useState(0);
  const [XL, setXL] = useState(1.5);
  const [XR, setXR] = useState(2);

  const adddata = async () => {
    const datadb = {
     Solution: "False Position",
     Equation: Equation, 
     Result: Xresult.toString()  
   };

   try {
     await axios.post("http://localhost:5000/data", datadb); 
   } catch (err) {
     console.log("Error posting data:", err); 
   }
 };

  const Calbisection = (xl, xr) => {
    let xm, fXm, fXr, fXl, ea, scope;
    let iter = 0;
    const MAX = 50;
    const e = 0.00001;

    const newGraphData = [];
    const tempData = [];

    do {
      scope = { x: xl };
      fXl = evaluate(Equation, scope);

      scope = { x: xr };
      fXr = evaluate(Equation, scope);

      xm = (xl * fXr - xr * fXl) / (fXr - fXl);

      scope = { x: xm };
      fXm = evaluate(Equation, scope);

      iter++;
      if (fXm * fXr > 0) {
        ea = error(xr, xm);
        xr = xm;
      } else if (fXm * fXr < 0) {
        ea = error(xl, xm);
        xl = xm;
      }

      tempData.push({ iteration: iter, Xl: xl, Xm: xm, Xr: xr, ar: ea, f: fXm });
      newGraphData.push({ x: xm, y: fXm });

    } while (ea > e && iter < MAX);

    setXresult(xm);
    setdatagraph(newGraphData);
    setData(tempData);

  };

  const inputEquation = (event) => {
    setEquation(event.target.value);
  };

  const inputXL = (event) => {
    setXL(parseFloat(event.target.value));
  };

  const inputXR = (event) => {
    setXR(parseFloat(event.target.value));
  };

  const calculateRoot = () => {
    const xlnum = parseFloat(XL)
    const xrnum = parseFloat(XR)
    Calbisection(xlnum, xrnum);
    adddata();
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
    ],
    layout: {
      title: "Graph",
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
        <h1 className="text-center font-bold text-4xl p-4">False position Method</h1>
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
                f(x)
              </label>
              <input type="text" id="equation" value={Equation} onChange={inputEquation} className="input input-bordered w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="equation">
                X Start
              </label>
              <input type="text" id="equation" value={XL} onChange={inputXL} className="input input-bordered w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="xr">
                X End
              </label>
              <input type="number" id="xr" value={XR} onChange={inputXR} className="input input-bordered w-full" />
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
            <table className="table table-zebra w-full border-2 shadow-lg ">
              <thead>
                <tr>
                  <th>Iteration</th>
                  <th>Xm</th>
                  <th>f(m)</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {data.map((element, index) => (
                  <tr key={index}>
                    <td>{element.iteration}</td>
                    <td>{element.Xm.toPrecision(7)}</td>
                    <td>{element.f.toPrecision(7)}</td>
                    <td>{element.ar.toPrecision(7)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </>
  )
}

export default page
