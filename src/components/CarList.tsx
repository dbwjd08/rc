// components/CarList.tsx
import React, { useEffect, useState } from "react";
import { fetchCollection } from "../lib/firestore"; // Ensure fetchCollection is implemented properly
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import StatusBar from "./StatusBar";

interface Car {
  id: string;
  status: number;
  place: number;
  workload: number;
  manager: string;
  move_cmd: string;
}

interface CarListProps {
  cars: string;
}

const CarList: React.FC<CarListProps> = ({ cars }) => {
  const [car, setCar] = useState<Car[]>([]); // State to hold Firestore data
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [selectedPlace, setSelectedPlace] = useState<number>(1);
  const [workload, setWorkload] = useState<number>(0);

  const tagList = { 317522557388: "신유정", 385133795688: "엄도윤" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set up Firestore real-time listener for the collection
        const carsRef = collection(db, cars);
        const unsubscribe = onSnapshot(carsRef, async (snapshot) => {
          // 비동기로 데이터를 처리
          const updatedCars = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const carData = doc.data();
              // 필요한 비동기 작업을 처리할 수 있음
              return {
                id: doc.id,
                ...carData,
              } as Car;
            })
          );

          // 조건에 따라 데이터 수정
          if (updatedCars.length > 0 && updatedCars[0].status === 2) {
            updatedCars[0].manager = tagList[updatedCars[0].tagged];
          }

          // 상태 업데이트
          setCar(updatedCars);
          setLoading(false);
        });

        // Clean up listener on component unmount
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Clean up function
    return () => {
      if (fetchData) fetchData();
    };
  }, [cars]);

  const updatePlace = async (carId: string, newPlace: number) => {
    try {
      console.log(newPlace);
      const carDocRef = doc(db, cars, carId); // Reference to the specific car document
      await updateDoc(carDocRef, { status: 1, place: newPlace });
      console.log(`Updated car ${carId} place to: ${newPlace}`);

      // Update local state after successful update
      setCar((prev) =>
        prev.map((car) =>
          car.id === carId ? { ...car, status: 1, place: newPlace } : car
        )
      );
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  const updateStatus = async (carId: string, num: number) => {
    try {
      const carDocRef = doc(db, cars, carId); // Reference to the specific car document
      await updateDoc(carDocRef, { status: num });

      // Update local state after successful update
      setCar((prev) =>
        prev.map((car) => (car.id === carId ? { ...car, status: num } : car))
      );
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  const updateWorkload = async (carId: string) => {
    try {
      if (workload === undefined) return; // Do nothing if no changes

      const carDocRef = doc(db, cars, carId); // Reference to the specific car document
      await updateDoc(carDocRef, { workload: workload });
    } catch (error) {
      console.error("Error updating workload:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Display loading text while fetching data
  }

  return (
    <div className="h-96 border border-4 rounded-lg flex flex-col p-5">
      <h2 className="font-bold ml-5 underline">{cars}</h2>
      <div>
        {car.map((car) => (
          <div key={car.id} className="mb-5">
            <StatusBar status={car.status} />
            <div className="flex items-center m-5">
              {car.status === 0 && (
                <p>
                  작업장 :
                  <select
                    value={selectedPlace}
                    onChange={(e) => setSelectedPlace(Number(e.target.value))}
                    className="border ml-2 px-2 py-1 rounded w-14"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                  <button
                    onClick={() => updatePlace(car.id, selectedPlace)}
                    className="ml-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    이동
                  </button>
                </p>
              )}
              {car.status === 3 && (
                <p className="flex gap-50 items-center w-full justify-between">
                  <div> 작업장 : {car.place}</div>
                  <button
                    onClick={() => updateStatus(car.id, 4)}
                    className="justify-self-end mr-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    복귀
                  </button>
                </p>
              )}
              {car.status === 4 && (
                <p className="flex gap-50 items-center w-full justify-between">
                  <div> 차고지</div>
                  <button
                    onClick={() => updateStatus(car.id, 0)}
                    className="justify-self-end mr-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    도착
                  </button>
                </p>
              )}
              {(car.status === 1 || car.status === 2) && (
                <p>작업장 : {car.place}</p>
              )}
            </div>
            {car.status > 0 && (
              <div className="m-5">작업량 : {car.workload}</div>
            )}
            {car.status === 0 && (
              <div className="m-5 flex items-center">
                작업량 :{" "}
                <input
                  type="number"
                  value={workload !== undefined ? workload : car.workload}
                  onChange={(e) => setWorkload(Number(e.target.value))}
                  className="border ml-2 px-2 py-1 rounded w-14"
                />
                <button
                  onClick={() => updateWorkload(car.id)}
                  className="ml-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  변경
                </button>
              </div>
            )}
            {car.status === 2 && (
              <div className="m-5">담당자 : {car.manager}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;
