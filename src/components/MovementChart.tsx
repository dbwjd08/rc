import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import axios from "axios";

// Chart.js 등록

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface MovementChartProps {
  commandsCar1: string[];
  commandsCar2: string[];
}

const MovementChart: React.FC<MovementChartProps> = ({
  commandsCar1,
  commandsCar2,
}) => {
  const [pathDataCar1, setPathDataCar1] = useState<{ x: number; y: number }[]>(
    []
  );
  const [pathDataCar2, setPathDataCar2] = useState<{ x: number; y: number }[]>(
    []
  );

  useEffect(() => {
    if (commandsCar1.length > 0) {
      fetchPathFromCommands("car1", commandsCar1);
    }
  }, [commandsCar1]);

  useEffect(() => {
    if (commandsCar2.length > 0) {
      fetchPathFromCommands("car2", commandsCar2);
    }
  }, [commandsCar2]);

  const fetchPathFromCommands = async (carId: string, commands: string[]) => {
    try {
      const response = await axios.post("/api/generatePath", { commands });
      if (Array.isArray(response.data.path)) {
        if (carId === "car1") {
          setPathDataCar1(response.data.path);
        } else if (carId === "car2") {
          setPathDataCar2(response.data.path);
        }
      }
    } catch (error) {
      console.error(`Error fetching path from commands for ${carId}:`, error);
    }
  };
  const getMinMaxValues = (data: { x: number; y: number }[]) => {
    if (data.length === 0) return { minX: -10, maxX: 10, minY: -10, maxY: 10 };

    const xValues = data.map((pos) => pos.x);
    const yValues = data.map((pos) => pos.y);

    const minX = Math.min(...xValues) - 2;
    const maxX = Math.max(...xValues) + 2;
    const minY = Math.min(...yValues) - 2;
    const maxY = Math.max(...yValues) + 2;

    return { minX, maxX, minY, maxY };
  };

  const {
    minX: minXCar1,
    maxX: maxXCar1,
    minY: minYCar1,
    maxY: maxYCar1,
  } = getMinMaxValues(pathDataCar1);
  const {
    minX: minXCar2,
    maxX: maxXCar2,
    minY: minYCar2,
    maxY: maxYCar2,
  } = getMinMaxValues(pathDataCar2);

  // 차트 데이터 설정 (Car 1)
  const scatterDataCar1 = {
    datasets: [
      {
        label: "Car 1 Path",
        data: pathDataCar1.map((pos) => ({ x: pos.x, y: pos.y })),
        borderColor: "blue",
        backgroundColor: "blue",
        pointRadius: pathDataCar1.map((_, index) =>
          index === pathDataCar1.length - 1 ? 8 : 4
        ),
        pointBackgroundColor: pathDataCar1.map((_, index) =>
          index === pathDataCar1.length - 1 ? "yellow" : "blue"
        ),
        showLine: true,
        fill: false,
      },
    ],
  };

  // 차트 데이터 설정 (Car 2)
  const scatterDataCar2 = {
    datasets: [
      {
        label: "Car 2 Path",
        data: pathDataCar2.map((pos) => ({ x: pos.x, y: pos.y })),
        borderColor: "red",
        backgroundColor: "red",
        pointRadius: pathDataCar2.map((_, index) =>
          index === pathDataCar2.length - 1 ? 8 : 4
        ),
        pointBackgroundColor: pathDataCar2.map((_, index) =>
          index === pathDataCar2.length - 1 ? "yellow" : "red"
        ),
        showLine: true,
        fill: false,
      },
    ],
  };

  // 차트 옵션 설정 (x축과 y축의 범위를 확장)
  const chartOptionsCar1 = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "X Position",
        },
        min: minXCar1,
        max: maxXCar1,
      },
      y: {
        title: {
          display: true,
          text: "Y Position",
        },
        min: minYCar1,
        max: maxYCar1,
        beginAtZero: false,
      },
    },
  };
  const chartOptionsCar2 = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "X Position",
        },
        min: minXCar2,
        max: maxXCar2,
      },
      y: {
        title: {
          display: true,
          text: "Y Position",
        },
        min: minYCar2,
        max: maxYCar2,
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="h-96 border border-4 rounded-lg p-5 flex items-center gap-3">
      <div className="w-1/2 h-full p-4">
        <h2 className="text-center mb-2">1번 차 경로</h2>
        {pathDataCar1.length > 0 ? (
          <div className="w-full h-[90%]">
            <Scatter data={scatterDataCar1} options={chartOptionsCar1} />
          </div>
        ) : (
          <p>이동 경로 없음</p>
        )}
      </div>
      <div className="w-1/2 h-full p-4">
        <h2 className="text-center mb-2">2번 차 경로</h2>
        {pathDataCar2.length > 0 ? (
          <div className="w-full h-[90%]">
            <Scatter data={scatterDataCar2} options={chartOptionsCar2} />
          </div>
        ) : (
          <p>이동 경로 없음</p>
        )}
      </div>
    </div>
  );
};

export default MovementChart;
