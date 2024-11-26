import React from "react";

interface VideoStreamProps {
  selectedCar: string; // selectedCar prop을 추가
}

const VideoStream: React.FC<VideoStreamProps> = ({ selectedCar }) => {
  // selectedCar에 따라 IP 주소 선택
  const raspberryPiIP =
    selectedCar === "car2" ? "192.168.137.98" : "192.168.137.175";

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-lg mx-auto h-full">
      <h1 className="text-center mt-2 font-bold">Camera Stream</h1>
      <div className="w-full h-[300px] overflow-hidden">
        {/* 이미지 크기를 조정하여 세로 길이 제한 */}
        <img
          src={`http://${raspberryPiIP}:8000/stream.mjpg`}
          alt="Raspberry Pi Camera Stream"
          className="w-full h-full object-cover border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default VideoStream;
