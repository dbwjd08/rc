// components/Dashboard.tsx
import React, { useState } from "react";
import Controller from "./Controller";
import MovementChart from "./MovementChart";

const Dashboard: React.FC = () => {
  const [commandsCar1, setCommandsCar1] = useState<string[]>([]);
  const [commandsCar2, setCommandsCar2] = useState<string[]>([]);

  const handleUpdateCommand = (carId: string, command: string) => {
    if (carId === "car1") {
      setCommandsCar1((prev) => [...prev, command]);
    } else if (carId === "car2") {
      setCommandsCar2((prev) => [...prev, command]);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <MovementChart commandsCar1={commandsCar1} commandsCar2={commandsCar2} />
      <Controller onUpdateCommand={handleUpdateCommand} />
    </div>
  );
};

export default Dashboard;
