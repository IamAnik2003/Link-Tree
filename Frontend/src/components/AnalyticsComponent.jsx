import React, { useState, useEffect } from "react";
import styles from "../components/Analytics.module.css"; // Import CSS Module
import calender1 from "../assets/calender1.png";
import calender2 from "../assets/calender2.png";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsComponent() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    linkClicks: 0,
    shopClicks: 0,
    getConnectedClicks: 0,
    facebookClicks: 0,
    instagramClicks: 0,
    otherClicks: 0,
    youtubeClicks: 0,
    platforms: {},
    clicksByLink: [],
  });
  const [clickDetails, setClickDetails] = useState([]);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const getCounts = async () => {
      try {
        const res = await axios.get("/api/getCounts", { params: { email } });
        if (res.status === 200) {
          setAnalyticsData(res.data);
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      }
    };

    const fetchClickDetails = async () => {
      try {
        const response = await axios.get("/api/getClickDetails", { params: { email } });
        if (response.status === 200) {
          setClickDetails(response.data.clicks);
        }
      } catch (error) {
        console.error("Error fetching click details:", error);
      }
    };

    getCounts();
    fetchClickDetails();
  }, [email]);

  const formatDate = (date) => {
    if (!date) return "";
    const options = { month: "short", day: "numeric" };
    let day = new Date(date).getDate();
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";
    return `${new Date(date).toLocaleString("en-US", { month: "short" })}${day}${suffix}`;
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const filterClickDetails = () => {
    if (!startDate || !endDate) return clickDetails;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return clickDetails.filter((click) => {
      const clickDate = new Date(click.date);
      return clickDate >= start && clickDate <= end;
    });
  };

  const dateRangeText =
    startDate && endDate
      ? `${formatDate(startDate)} to ${formatDate(endDate)}`
      : "Feb 9th to Feb 15th";

  const filteredClickDetails = filterClickDetails();

  const aggregateClicksByMonth = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const clicksByMonth = months.map(() => 0);
    filteredClickDetails.forEach((click) => {
      const clickDate = new Date(click.date);
      const monthIndex = clickDate.getMonth();
      if (click.type === "link" || click.type === "shop") {
        clicksByMonth[monthIndex] += 1;
      }
    });
    return clicksByMonth;
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Total Clicks (Links + Shops)",
        data: aggregateClicksByMonth(),
        fill: true,
        borderColor: "#000000",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => (value >= 1000 ? `${value / 1000}k` : value), stepSize: 1000, max: 3000 },
        grid: { display: false },
        border: { display: false },
      },
      x: { grid: { display: false }, border: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.y}` } },
    },
  };

  const aggregateClicksByDevice = () => {
    const devices = ["Linux", "Mac", "iOS", "Windows", "Android", "Others"];
    const clicksByDevice = devices.map(() => 0);
    filteredClickDetails.forEach((click) => {
      const platform = click.platform || "Others";
      const deviceIndex = devices.indexOf(platform);
      if (deviceIndex !== -1 && (click.type === "link" || click.type === "shop")) {
        clicksByDevice[deviceIndex] += 1;
      }
    });
    return clicksByDevice;
  };

  const barChartData = {
    labels: ["Linux", "Mac", "iOS", "Windows", "Android", "Others"],
    datasets: [
      {
        label: "Total Clicks (Links + Shops)",
        data: aggregateClicksByDevice(),
        backgroundColor: ["#92FFC6", "#9BEBC1", "#165534", "#3EE58F", "#A1D4BA", "#21AF66"],
        borderColor: ["#92FFC6", "#9BEBC1", "#165534", "#3EE58F", "#A1D4BA", "#21AF66"],
        borderWidth: 1,
        borderRadius: { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20 },
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => (value >= 1000 ? `${value / 1000}k` : value) },
        grid: { display: false },
        border: { display: false },
      },
      x: { grid: { display: false }, border: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.parsed.y}` } },
    },
  };

  const doughnutChartData = {
    labels: ["YouTube", "Facebook", "Instagram", "Others"],
    datasets: [
      {
        label: "Clicks",
        data: [
          analyticsData.youtubeClicks,
          analyticsData.facebookClicks,
          analyticsData.instagramClicks,
          analyticsData.otherClicks,
        ],
        backgroundColor: ["#165534", "#3EE58F", "#94E9B8", "#21AF66"],
        borderColor: ["#165534", "#3EE58F", "#94E9B8", "#21AF66"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } },
    },
  };

  const aggregateClicksByUrl = () => {
    const urlClicks = {};
    const uniqueUrls = [];
    filteredClickDetails.forEach((click) => {
      if (click.url) {
        if (!uniqueUrls.includes(click.url)) {
          uniqueUrls.push(click.url);
        }
        urlClicks[click.url] = (urlClicks[click.url] || 0) + 1;
      }
    });
    const labels = uniqueUrls.map((_, index) => `Link ${index + 1}`);
    const data = uniqueUrls.map((url) => urlClicks[url] || 0);
    return { labels, data, uniqueUrls };
  };

  const linkClicksChartData = () => {
    const { labels, data, uniqueUrls } = aggregateClicksByUrl();
    const baseColors = ["#3EE58F", "#165534", "#94E9B8", "#A1D4BA", "#21AF66", "#92FFC6", "#9BEBC1"];
    const colors = labels.map((_, index) => baseColors[index % baseColors.length]);

    return {
      labels: labels.length ? labels : ["No Links"],
      datasets: [
        {
          label: "Clicks by Individual Link",
          data: data.length ? data : [0],
          backgroundColor: data.length ? colors : ["#CCCCCC"],
          borderColor: data.length ? colors : ["#CCCCCC"],
          borderWidth: 1,
          borderRadius: { topLeft: 20, topRight: 20, bottomLeft: 20, bottomRight: 20 },
        },
      ],
      uniqueUrls: uniqueUrls.length ? uniqueUrls : [],
    };
  };

  const linkClicksChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => (value >= 1000 ? `${value / 1000}k` : value) },
        grid: { display: false },
        border: { display: false },
      },
      x: { grid: { display: false }, border: { display: false } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
          title: (context) => {
            const chartData = context[0].chart.data;
            const index = context[0].dataIndex;
            return chartData.uniqueUrls[index] || "No URL";
          },
        },
        enabled: (context) => context.chart.data.uniqueUrls.length > 0,
      },
    },
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["overview"]}>
        <p>Overview</p>
        <div className={styles["calender-div"]}>
          <label htmlFor="start-date" className={styles["date-display"]}>
            <img src={calender1} alt="Start date" />
            <span>{dateRangeText}</span>
            <img src={calender2} alt="End date" />
          </label>
          <div className={styles["date-inputs"]}>
            <input type="date" id="start-date" value={startDate || ""} onChange={handleStartDateChange} className={styles["date-picker"]} />
            <input type="date" id="end-date" value={endDate || ""} onChange={handleEndDateChange} min={startDate} className={styles["date-picker"]} />
          </div>
        </div>
      </div>
      <div className={styles["analytics-content"]}>
        <div className={styles["parent1"]}>
          <div className={styles["link"]}>
            <p>Clicks on Links</p>
            <p style={{ fontWeight: "bold", fontSize: "2em" }}>{analyticsData.linkClicks}</p>
          </div>
          <div className={styles["shop"]}>
            <p>Clicks on Shops</p>
            <p style={{ fontWeight: "bold", fontSize: "2em" }}>{analyticsData.shopClicks}</p>
          </div>
          <div className={styles["cta"]}>
            <p>CTA</p>
            <p style={{ fontWeight: "bold", fontSize: "2em" }}>{analyticsData.getConnectedClicks}</p>
          </div>
        </div>

        <div className={styles["total-clicks"]}>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        <div className={styles["parent2"]}>
          <div className={styles["trafic-by-device"]}>
            <h4>Traffic By Device</h4>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          <div className={styles["sites"]}>
            <h4>Sites</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ width: "150px", height: "150px" }}>
                <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
              </div>
              <div>
                <ul>
                  <li className={styles["youtube"]}>YouTube: {analyticsData.youtubeClicks}</li>
                  <li className={styles["facebook"]}>Facebook: {analyticsData.facebookClicks}</li>
                  <li className={styles["instagram"]}>Instagram: {analyticsData.instagramClicks}</li>
                  <li className={styles["others"]}>Others: {analyticsData.otherClicks}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={styles["traffic-by-links"]}>
          <h4>Traffic by Links</h4>
          <div style={{ height: "300px" }}>
            <Bar data={linkClicksChartData()} options={linkClicksChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}