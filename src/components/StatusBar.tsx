// components/StatusBar.tsx
import React from "react";

interface StatusBarProps {
  status: number; // Current status (0-5)
}

const stages = [
  { label: "차고지" },
  { label: "이동 중" },
  { label: "작업 시작" },
  { label: "작업 완료" },
  { label: "복귀 중" },
];

const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  return (
    <div className="flex flex-col items-center my-5">
      <h2 className="font-semibold mb-5">차량 상태</h2>
      <div className="flex items-center space-x-4">
        {stages.map((stage, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Circle Icon */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index <= status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-sm ${
                index <= status ? "text-blue-500" : "text-gray-500"
              }`}
            >
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBar;
