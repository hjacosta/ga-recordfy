import React from "react";
import { TopBar } from "../../components/TopBar";
import Layout from "../../components/Layout";
import { FaCalendarAlt } from "react-icons/fa";
import "./index.css";
import { PieChart } from "../../components/PieChar";
import { DoughnutChart } from "../../components/DoughnutChart";
import { BarChart } from "../../components/BarChart";

function HomeScreen() {
  let stats = [
    {
      title: "Expendientes",
      value: 0,
    },
    {
      title: "Incompletos",
      value: 0,
    },
    {
      title: "Completos",
      value: 0,
    },
  ];

  let chartData = {
    labels: ["Restantes", "Subidos"],
    datasets: [
      {
        // label: "archivos",
        data: [1, 3],
        backgroundColor: ["transparent", "#99bee2"],
        borderColor: ["blue"],
        borderWidth: 0.5,
      },
    ],
  };

  let barChartData = {
    labels: ["Total", "Sbuidos", "Restantes", "Total", "Sbuidos", "Restantes"],
    datasets: [
      {
        label: "Subidos",
        data: [1, 4, 0, 1, 2, 0],
        backgroundColor: "#99bee2",
      },
      {
        label: "Restantes",
        data: [1, 0, 3, 1, 2, 4],
        backgroundColor: "rgba(0,0,0,0.05)",
      },
    ],
  };

  return (
    <div className="home">
      <TopBar label="Dashboard" />

      <Layout>
        <div className="StatsCard-filters">
          <div className="StatsCard-filters-item">
            <FaCalendarAlt style={{ marginLeft: 10 }} />
            <select>
              <option>Esta semana</option>
              <option>Este mes</option>
              <option>Los últimos 3 meses</option>
              <option>Los últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="StatsCard-filters-item">
            <FaCalendarAlt style={{ marginLeft: 10 }} />
            <select>
              <option>Esta semana</option>
              <option>Este mes</option>
              <option>Los últimos 3 meses</option>
              <option>Los últimos 6 meses</option>
              <option>Último año</option>
            </select>
          </div>
        </div>
        <div className="StatsCard-container">
          {stats.map((item) => (
            <StatsCard
              title={item.title}
              count={item.value}
              variant={item.variant}
            />
          ))}
        </div>
        <div className="Charts-container">
          <div>
            <BarChart data={barChartData} />
          </div>
          <div>
            <DoughnutChart />
          </div>
        </div>
      </Layout>
    </div>
  );
}

function StatsCard(props) {
  return (
    <div className={`StatsCard ${props.variant == "dark" ? "dark" : ""}`}>
      <div className="StatsCard-header"> {props.title}</div>
      <div className="StatsCard-body">
        <h2>{props.count}</h2>
        <p>Total</p>
      </div>
      <div className="StatsCard-footer">filter</div>
    </div>
  );
}

export { HomeScreen };
