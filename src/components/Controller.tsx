import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import VideoStream from "./VideoStream";

interface ControllerProps {
  onUpdateCommand: (carId: string, command: string) => void;
}

const Controller: React.FC<ControllerProps> = ({ onUpdateCommand }) => {
  const [selectedCar, setSelectedCar] = useState<string>("car1");
  const [docId, setDocId] = useState<string>("");
  const [status, setStatus] = useState<number | null>(null); // 현재 status 저장

  // 선택한 차량의 docId 가져오기
  useEffect(() => {
    const fetchDocIdAndStatus = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, selectedCar));
        if (!querySnapshot.empty) {
          const firstDoc = querySnapshot.docs[0];
          setDocId(firstDoc.id);

          // Fetch the status of the selected car
          const carDocRef = doc(db, selectedCar, firstDoc.id);
          const carDoc = await getDoc(carDocRef);
          if (carDoc.exists()) {
            const carData = carDoc.data();
            setStatus(carData.status || null); // status 값을 업데이트
          }
        }
      } catch (error) {
        console.error("Error fetching document ID or status:", error);
      }
    };

    fetchDocIdAndStatus();
  }, [selectedCar]);

  // move_cmd 업데이트 함수
  const updateMoveCommand = async (command: string) => {
    try {
      const carDocRef = doc(db, selectedCar, docId);
      await updateDoc(carDocRef, { move_cmd: command });
      console.log(`Updated move_cmd to: ${command}`);
      onUpdateCommand(selectedCar, command);
    } catch (error) {
      console.error("Error updating move_cmd:", error);
    }
  };

  // 버튼 비활성화 여부 확인
  const isButtonDisabled = status !== 1 && status !== 4;

  return (
    <div>
      <div className="h-96 border border-4 rounded-lg p-5 flex gap-5">
        <VideoStream selectedCar={selectedCar} />
        <div className="flex flex-col items-center gap-3 w-1/2">
          <div className="flex items-center gap-5 mt-2 mb-5">
            <select
              value={selectedCar}
              onChange={(e) => setSelectedCar(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded shadow focus:outline-none"
            >
              <option value="car1">Car 1</option>
              <option value="car2">Car 2</option>
            </select>
            <h2 className="font-bold text-center">Controller</h2>
          </div>
          <button
            onClick={() => updateMoveCommand("GO")}
            className={`bg-gray-300 w-20 px-4 py-2 rounded shadow hover:bg-gray-400 ${
              isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isButtonDisabled}
          >
            Go
          </button>
          <div className="flex gap-5">
            <button
              onClick={() => updateMoveCommand("LEFT")}
              className={`bg-gray-300 w-20 px-4 py-2 rounded shadow hover:bg-gray-400 ${
                isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isButtonDisabled}
            >
              Left
            </button>
            <button
              onClick={() => updateMoveCommand("MID")}
              className={`bg-gray-300 w-20 px-4 py-2 rounded shadow hover:bg-gray-400 ${
                isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isButtonDisabled}
            >
              Mid
            </button>
            <button
              onClick={() => updateMoveCommand("RIGHT")}
              className={`bg-gray-300 w-20 px-4 py-2 rounded shadow hover:bg-gray-400 ${
                isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isButtonDisabled}
            >
              Right
            </button>
          </div>
          <button
            onClick={() => updateMoveCommand("BACK")}
            className={`bg-gray-300 w-20 px-4 py-2 rounded shadow hover:bg-gray-400 ${
              isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isButtonDisabled}
          >
            Back
          </button>
          <button
            onClick={() => updateMoveCommand("STOP")}
            className={`mt-5 bg-gray-300 w-20 px-4 py-2 rounded shadow hover:bg-gray-400 ${
              isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isButtonDisabled}
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controller;
