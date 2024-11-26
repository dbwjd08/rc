// pages/cars.tsx
import React from "react";
import CarList from "@/components/CarList";
import Dashboard from "@/components/Dashboard";

const CarsPage: React.FC = () => {
  return (
    <div className="mt-10">
      <h3 className="text-center font-bold text-2xl">무인 물류작업</h3>
      <div className="h-full flex m-10 gap-5">
        <div className="flex flex-col gap-5 w-1/3">
          <CarList cars={"car1"} />
          <CarList cars={"car2"} />
        </div>
        <div className="flex flex-col w-2/3 gap-5">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
