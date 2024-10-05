'use client'
import { Line } from 'react-chartjs-2';
import { useState } from "react";
import { Button, Container, Form, Table } from "react-bootstrap";
import { evaluate } from 'mathjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const page = () => {

  const [datagraph, setdatagraph] = useState([]); // สำหรับเก็บข้อมูลกราฟ
  const [data, setData] = useState([]); // สำหรับเก็บข้อมูลตาราง
  const [html, setHtml] = useState(null); // ต้องประกาศ html ด้วย useState เพื่อจัดการการแสดงผลตาราง
  const [Equation, setEquation] = useState('(x^4) - 13'); // สมการเริ่มต้น
  const [Xstart, setXstart] = useState(-10); // ค่าจุดเริ่มต้น
  const [Xend, setXend] = useState(10); // ค่าจุดสิ้นสุด
  const [Error, setError] = useState(0.00001); // ค่าความคลาดเคลื่อน
  const [Xresult, setXresult] = useState(0.0); // ตั้งค่า Xresult เป็น 0.0 เริ่มต้น

  // ฟังก์ชันสำหรับแสดงตารางผลลัพธ์
  const print = (results) => {
    return (
      <Container>
        <Table striped bordered hover variant="dark" className='text-center mt-5'>
          <thead>
            <tr>
              <th>Iteration</th>
              <th>X</th>
              <th>f(X)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((element, index) => (
              <tr key={index}>
                <td>{element.iteration}</td>
                <td>{element.x}</td>
                <td>{element.fx}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    )
  }

  // ฟังก์ชันคำนวณ graphical method
  const CalGraphical = (Xstart, Xend, Equation) => {
    let results = [];
    let graphData = [];

    let iteration = 0;
    let step = (Xend - Xstart) / 100; // กำหนดช่วงความถี่ของการคำนวณ
    for (let x = Xstart; x <= Xend; x += step) {
      iteration++;
      let scope = { x: x };
      let fX = evaluate(Equation, scope); // ประเมินสมการที่ค่า x ปัจจุบัน

      results.push({ iteration: iteration, x: x, fx: fX }); // เก็บผลลัพธ์ลงในตาราง
      graphData.push({ x: x, y: fX }); // เก็บข้อมูลสำหรับกราฟ
    }

    setData(results); // ตั้งค่าผลลัพธ์ในตาราง
    setdatagraph(graphData); // ตั้งค่าข้อมูลสำหรับกราฟ
    setHtml(print(results)); // อัปเดตตารางทันทีหลังคำนวณเสร็จ
  };

  // ฟังก์ชันที่ทำงานเมื่อผู้ใช้กดปุ่ม Calculate
  const calculateRoot = () => {
    CalGraphical(Xstart, Xend, Equation);
  };

  const chartData = {
    labels: datagraph.map((data) => data.x), // ใช้ค่า x เป็น label
    datasets: [
      {
        label: 'f(x)',
        data: datagraph.map((data) => data.y), // ข้อมูล y คือค่า f(x)
        fill: false,
        borderColor: 'blue',
        tension: 0.1
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'black'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'black'
        }
      },
      y: {
        ticks: {
          color: 'black'
        }
      }
    }
  };

  return (
    <Container>
      <Form className='p-5'>
        <h1 className="text-center font-bold text-3xl p-4">Graphical Method</h1>

        <Form.Group>
          <Form.Label className='p-5'>Input f(x)</Form.Label>
          <input type="text" value={Equation} onChange={(e) => setEquation(e.target.value)} style={{ width: "14%", margin: "0 auto" }} className="form-control p-2" />
        </Form.Group>

        <Form.Group>
          <Form.Label className='p-5'>Input Xstart</Form.Label>
          <input type="number" value={Xstart} onChange={(e) => setXstart(parseFloat(e.target.value))} style={{ width: "14%", margin: "0 auto" }} className="form-control p-2" />
        </Form.Group>

        <Form.Group>
          <Form.Label className='p-5'>Input Xend</Form.Label>
          <input type="number" value={Xend} onChange={(e) => setXend(parseFloat(e.target.value))} style={{ width: "14%", margin: "0 auto" }} className="form-control p-2" />
        </Form.Group>

        <ul className='text-center p-8'>
          <Button variant="dark" onClick={calculateRoot} className="p-4" style={{ display: 'block', margin: '0 auto' }}>
            Calculate
          </Button>
        </ul>
      </Form>

      <Container className='p-9'>
        {html} {/* แสดงผลตาราง */}
      </Container>

      <Container>
        <h1 className="text-center font-bold text-2xl p-6">Graph f(x)</h1>
        <Line data={chartData} options={options} />
      </Container>
    </Container>
  );
};

export default page;
