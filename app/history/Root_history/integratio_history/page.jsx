"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    showAll();
  }, []);

  const showAll = async () => {
    try {
      const resp = await axios.get('http://localhost:5000/data');
      setData(resp.data);
      console.log(resp.data);
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  return (
    <div className="text-center bg-app/image/Heaven-FOT-1.jpg">
      <h1 className="text-5xl font-bold p-12">History: Root of Equation</h1>
      <h2 className="text-2xl font-bold"></h2>
      <h3 className="text-2xl font-bold py-10"></h3>
      
       <div className="mx-auto">
        <h1 className="block text-gray-700 text-sm font-bold mb-2"></h1>
        <div className="p-3 border-2 shadow-lg">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Solution</th>
                  <th>Equation</th>
                  <th>Result</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {data.map((element, index) => (
                  <tr key={index}>
                    <td>{element.id}</td>
                    <td>{element.Solution}</td>
                    <td>{element.Equation}</td>
                    <td>{element.Result}</td>
                    <td>{element.Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}