// import React, { useEffect, useState, useRef } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";
// import API from "../services/api";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import "../styles/graphd.css";

// const DeviceGraphs = () => {
//   const { deviceId } = useParams();
//   const [sensorData, setSensorData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedGraph, setExpandedGraph] = useState(null);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const graphRefs = useRef({});

//   // Define which fields to display graphs for
//   const dataFields = ["data3", "data4"];
//   const descriptiveNames = {
//     data3: "Total Cumulative Flow (m³)",
//     data4: "Positive Cumulative Flow (m³)",
//   };
//   const colors = {
//     data3: "#8884d8",
//     data4: "#82ca9d",
//   };

//   useEffect(() => {
//     const fetchSensorData = async () => {
//       try {
//         const res = await API.get(`/sensor-data/device/${deviceId}`);
//         const formattedData = (res.data || []).map((item) => ({
//           ...item,
//           rawDate: new Date(item.createdAt),
//           createdAt: new Date(item.createdAt),
//           data1: Number(item.data1) || 0,
//           data2: Number(item.data2) || 0,
//           data3: Number(item.data3) || 0,
//           data4: Number(item.data4) || 0,
//           data5: Number(item.data5) || 0,
//           data6: Number(item.data6) || 0,
//         }));
//         setSensorData(formattedData);

//         // Set default filter to the last 2 months
//         const twoMonthsAgo = new Date();
//         twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
//         setFromDate(twoMonthsAgo.toISOString().split("T")[0]);
//         setToDate(new Date().toISOString().split("T")[0]);

//       } catch (error) {
//         console.error("Error fetching sensor data:", error);
//       }
//       setLoading(false);
//     };

//     fetchSensorData();
//   }, [deviceId]);

//   useEffect(() => {
//     const from = fromDate ? new Date(fromDate) : null;
//     let to = toDate ? new Date(toDate) : null;

//     if (to) {
//       to.setHours(23, 59, 59, 999);
//     }

//     const filtered = sensorData.filter((item) => {
//       const itemDate = item.rawDate;
//       const isAfterFrom = !from || itemDate >= from;
//       const isBeforeTo = !to || itemDate <= to;
//       return isAfterFrom && isBeforeTo;
//     });

//     setFilteredData(filtered);
//   }, [fromDate, toDate, sensorData]);

//   const downloadGraphAsPDF = async (graphKey) => {
//     const element = graphRefs.current[graphKey];
//     if (!element) return;

//     const canvas = await html2canvas(element);
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("landscape");
//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
//     const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

//     pdf.addImage(imgData, "PNG", x, y, pdfWidth, pdfHeight);
//     pdf.save(`pinea-metering-graph-${graphKey}.pdf`);
//   };

//   const downloadAllGraphsAsPDF = async () => {
//     const pdf = new jsPDF("landscape");

//     const keys = Object.keys(graphRefs.current);
//     for (let i = 0; i < keys.length; i++) {
//       const key = keys[i];
//       const element = graphRefs.current[key];
//       if (!element) continue;

//       const canvas = await html2canvas(element);
//       const imgData = canvas.toDataURL("image/png");
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
//       const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

//       pdf.addImage(imgData, "PNG", x, y, pdfWidth, pdfHeight);

//       if (i < keys.length - 1) {
//         pdf.addPage("landscape");
//       }
//     }

//     pdf.save("pinea-metering-all-graphs.pdf");
//   };

//   const formatXAxisTick = (date) => {
//     return date.toLocaleDateString();
//   };

//   const Graph = ({ field, color, height = 300, type = "line" }) => {
//     const GraphComponent = type === "bar" ? BarChart : LineChart;
//     const DataComponent = type === "bar" ? Bar : Line;

//     return (
//       <div ref={(el) => (graphRefs.current[field] = el)}>
//         <ResponsiveContainer width="100%" height={height}>
//           <GraphComponent
//             data={filteredData}
//             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="createdAt"
//               tickFormatter={formatXAxisTick}
//               minTickGap={20}
//               tick={{ fontSize: 12, angle: -45, textAnchor: "end" }}
//             />
//             <YAxis
//               tick={{ fontSize: 12 }}
//               width={80}
//               label={{ value: descriptiveNames[field], angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle' } }}
//             />
//             <Tooltip
//               labelFormatter={(value) => `Date: ${formatXAxisTick(value)}`}
//               contentStyle={{
//                 backgroundColor: "#1f2937",
//                 borderColor: "#22d3ee",
//                 borderRadius: "4px",
//                 color: "#e0e6e9",
//               }}
//               itemStyle={{ color: "#e0e6e9" }}
//               labelStyle={{ color: "#a5f3fc", fontWeight: "bold" }}
//             />
//             <Legend />
//             <DataComponent
//               type="monotone"
//               dataKey={field}
//               stroke={color}
//               fill={color}
//               activeDot={{ r: 8 }}
//               dot={false} // This hides the dot points
//               name={descriptiveNames[field]}
//               strokeWidth={2}
//             />
//           </GraphComponent>
//         </ResponsiveContainer>
//       </div>
//     );
//   };

//   if (loading) return <div className="loading">Loading graphs...</div>;
//   if (!sensorData.length)
//     return <div className="no-data">No sensor data found for this device.</div>;

//   return (
//     <div className="graphs-container">
//       <div className="btn_links">
//         <Link to={`/devices/${deviceId}`} className="back-link">
//           ← Back to Device Details
//         </Link>
//         <button className="download-all-btn" onClick={downloadAllGraphsAsPDF}>
//           Download All Graphs as PDF
//         </button>
//       </div>

//       <div className="date-filter">
//         <label>From:</label>
//         <input
//           type="date"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//           max={toDate || ""}
//         />

//         <label>To:</label>
//         <input
//           type="date"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//           min={fromDate || ""}
//         />

//         {(fromDate || toDate) && (
//           <button
//             onClick={() => {
//               setFromDate("");
//               setToDate("");
//             }}
//           >
//             ×
//           </button>
//         )}
//       </div>

//       <h2 className="graphs-title">Graphs for Device: {deviceId}</h2>

//       <div className="graphs-grid">
//         {dataFields.map((field, index) => (
//           <div
//             key={field}
//             className="graph-card"
//             onClick={() => setExpandedGraph(field)}
//           >
//             <div className="graph-header">
//               <h3>{descriptiveNames[field]}</h3>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   downloadGraphAsPDF(field);
//                 }}
//               >
//                 Download PDF
//               </button>
//             </div>
//             {/* Show LineChart for both, but you can add conditional rendering for bar charts if needed */}
//             <Graph
//               field={field}
//               color={colors[field]}
//               height={280}
//               type={field === 'data3' || field === 'data4' ? 'bar' : 'line'}
//             />
//           </div>
//         ))}
//       </div>

//       {expandedGraph && (
//         <div className="graph-modal" onClick={() => setExpandedGraph(null)}>
//           <div
//             className="graph-modal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="close-modal"
//               onClick={() => setExpandedGraph(null)}
//             >
//               ×
//             </button>
//             <div className="expanded-graph-header">
//               <h3>{descriptiveNames[expandedGraph]}</h3>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   downloadGraphAsPDF(expandedGraph);
//                 }}
//               >
//                 Download PDF
//               </button>
//             </div>
//             <Graph
//               field={expandedGraph}
//               color={colors[expandedGraph]}
//               height={600}
//               type={expandedGraph === 'data3' || expandedGraph === 'data4' ? 'bar' : 'line'}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeviceGraphs;
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import API from "../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/graphd.css";

const DeviceGraphs = () => {
  const { deviceId } = useParams();
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGraph, setExpandedGraph] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const graphRefs = useRef({});

  const graphsToRender = [
    { field: "data3", type: "line", key: "data3-line", name: "Total Cumulative Flow (Line)" },
    { field: "data3", type: "bar", key: "data3-bar", name: "Total Cumulative Flow (Bar)" },
    { field: "data4", type: "line", key: "data4-line", name: "Positive Cumulative Flow (Line)" },
    { field: "data4", type: "bar", key: "data4-bar", name: "Positive Cumulative Flow (Bar)" },
  ];

  const colors = {
    data3: "#8884d8",
    data4: "#82ca9d",
  };
  
  const pdfColor = "#000000";

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await API.get(`/sensor-data/device/${deviceId}`);
        const formattedData = (res.data || []).map((item) => ({
          ...item,
          rawDate: new Date(item.createdAt),
          createdAt: new Date(item.createdAt),
          data1: Number(item.data1) || 0,
          data2: Number(item.data2) || 0,
          data3: Number(item.data3) || 0,
          data4: Number(item.data4) || 0,
          data5: Number(item.data5) || 0,
          data6: Number(item.data6) || 0,
        }));
        setSensorData(formattedData);

        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        setFromDate(twoMonthsAgo.toISOString().split("T")[0]);
        setToDate(new Date().toISOString().split("T")[0]);

      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
      setLoading(false);
    };

    fetchSensorData();
  }, [deviceId]);

  useEffect(() => {
    const from = fromDate ? new Date(fromDate) : null;
    let to = toDate ? new Date(toDate) : null;

    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    const filtered = sensorData.filter((item) => {
      const itemDate = item.rawDate;
      const isAfterFrom = !from || itemDate >= from;
      const isBeforeTo = !to || itemDate <= to;
      return isAfterFrom && isBeforeTo;
    });

    setFilteredData(filtered);
  }, [fromDate, toDate, sensorData]);

  const prepareGraphForPDF = (element) => {
    const originalStyles = [];
    
    // Select all relevant SVG elements
    const elementsToStyle = [
      ...element.querySelectorAll('svg path, svg line, svg text'),
    ];

    elementsToStyle.forEach(el => {
      const originalStroke = el.style.stroke || el.getAttribute('stroke');
      const originalFill = el.style.fill || el.getAttribute('fill');
      originalStyles.push({ el, originalStroke, originalFill });

      if (el.tagName === 'text') {
        el.style.fill = pdfColor; // Use style property for text
      } else if (el.tagName === 'path') {
        // Line charts use stroke, Bar charts use fill
        if (el.getAttribute('class').includes('recharts-bar-rectangle')) {
          el.style.fill = pdfColor;
        } else {
          el.style.stroke = pdfColor;
        }
      } else {
        el.style.stroke = pdfColor;
      }
    });

    return () => {
      originalStyles.forEach(({ el, originalStroke, originalFill }) => {
        if (el.tagName === 'text') {
          el.style.fill = originalFill;
        } else if (el.tagName === 'path') {
          if (el.getAttribute('class').includes('recharts-bar-rectangle')) {
            el.style.fill = originalFill;
          } else {
            el.style.stroke = originalStroke;
          }
        } else {
          el.style.stroke = originalStroke;
        }
      });
    };
  };

  const downloadGraphAsPDF = async (graphKey) => {
    const element = graphRefs.current[graphKey];
    if (!element) return;

    const restoreStyles = prepareGraphForPDF(element);

    const canvas = await html2canvas(element, { backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
    const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, pdfWidth, pdfHeight);
    pdf.save(`pinea-metering-graph-${graphKey}.pdf`);
    
    restoreStyles();
  };

  const downloadAllGraphsAsPDF = async () => {
    const pdf = new jsPDF("landscape");

    for (let i = 0; i < graphsToRender.length; i++) {
      const graphItem = graphsToRender[i];
      const key = graphItem.key;
      const element = graphRefs.current[key];
      if (!element) continue;
      
      const restoreStyles = prepareGraphForPDF(element);

      const canvas = await html2canvas(element, { backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const x = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
      const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, pdfWidth, pdfHeight);

      if (i < graphsToRender.length - 1) {
        pdf.addPage("landscape");
      }
      
      restoreStyles();
    }

    pdf.save("pinea-metering-all-graphs.pdf");
  };

  const formatXAxisTick = (date) => {
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const Graph = ({ field, color, height = 300, type = "line", graphName }) => {
    const ChartComponent = type === "bar" ? BarChart : LineChart;
    const DataComponent = type === "bar" ? Bar : Line;

    return (
      <div ref={(el) => (graphRefs.current[`${field}-${type}`] = el)}>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="createdAt"
              tickFormatter={formatXAxisTick}
              minTickGap={20}
              tick={{ fontSize: 12, angle: -45, textAnchor: "end", fill: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#cbd5e1' }}
              width={80}
              label={{ value: graphName, angle: -90, position: 'insideLeft', offset: -5, style: { textAnchor: 'middle', fill: '#a5f3fc' } }}
            />
            <Tooltip
              labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#22d3ee",
                borderRadius: "4px",
                color: "#e0e6e9",
              }}
              itemStyle={{ color: "#e0e6e9" }}
              labelStyle={{ color: "#a5f3fc", fontWeight: "bold" }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', color: '#e0e6e9' }} />
            <DataComponent
              type="monotone"
              dataKey={field}
              stroke={color}
              fill={type === "bar" ? color : undefined}
              activeDot={{ r: 8 }}
              dot={type === "line" ? false : undefined}
              name={graphName}
              strokeWidth={2}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading graphs...</div>;
  if (!sensorData.length)
    return <div className="no-data">No sensor data found for this device.</div>;

  return (
    <div className="graphs-container">
      <div className="btn_links">
        <Link to={`/devices/${deviceId}`} className="back-link">
          ← Back to Device Details
        </Link>
        <button className="download-all-btn" onClick={downloadAllGraphsAsPDF}>
          Download All Graphs as PDF
        </button>
      </div>

      <div className="date-filter">
        <label>From:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          max={toDate || ""}
        />

        <label>To:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          min={fromDate || ""}
        />

        {(fromDate || toDate) && (
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            className="clear-date-btn"
          >
            ×
          </button>
        )}
      </div>

      <h2 className="graphs-title">Graphs for Device: {deviceId}</h2>

      <div className="graphs-grid">
        {graphsToRender.map((graphItem) => (
          <div
            key={graphItem.key}
            className="graph-card"
            onClick={() => setExpandedGraph(graphItem.key)}
          >
            <div className="graph-header">
              <h3>{graphItem.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadGraphAsPDF(graphItem.key);
                }}
              >
                Download PDF
              </button>
            </div>
            <Graph
              field={graphItem.field}
              color={colors[graphItem.field]}
              height={280}
              type={graphItem.type}
              graphName={graphItem.name}
            />
          </div>
        ))}
      </div>

      {expandedGraph && (
        <div className="graph-modal" onClick={() => setExpandedGraph(null)}>
          <div
            className="graph-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setExpandedGraph(null)}
            >
              ×
            </button>
            <div className="expanded-graph-header">
              <h3>{graphsToRender.find(g => g.key === expandedGraph)?.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadGraphAsPDF(expandedGraph);
                }}
              >
                Download PDF
              </button>
            </div>
            <Graph
              field={graphsToRender.find(g => g.key === expandedGraph)?.field}
              color={colors[graphsToRender.find(g => g.key === expandedGraph)?.field]}
              height={600}
              type={graphsToRender.find(g => g.key === expandedGraph)?.type}
              graphName={graphsToRender.find(g => g.key === expandedGraph)?.name}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceGraphs;