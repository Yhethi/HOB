import React, { useState, useRef } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

export const Scanner = () => {
  const [codeScanned, setCodeScanned] = useState("");
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const initScan = () => {
    if (isScanning) return;

    const codeReader = new BrowserMultiFormatReader();

    try {
      codeReader.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          if (result) {
            const code = result.getText();
            console.log("Código detectado: ", code);
            setCodeScanned(code);
            codeReader.reset();
            setIsScanning(false);
          }
          if (err && !(err instanceof NotFoundException)) {
            console.error(err);
          }
        }
      );

      // Adjust the resolution here
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getVideoTracks();
        tracks[0].applyConstraints({
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "environment", // Use the back camera on mobile devices
        });
      }

      setIsScanning(true);
    } catch (error) {
      console.error("Error al iniciar el escaneo: ", error);
      setIsScanning(false);
    }
  };

  return (
    <div>
      <h1>Scanner - Código Detectado: {codeScanned}</h1>
      <button onClick={initScan} disabled={isScanning}>
        {isScanning ? "Escaneando..." : "Activar Cámara"}
      </button>
      <video
        ref={videoRef}
        style={{ width: "100%", height: "400px", border: "1px solid black" }}
      ></video>
    </div>
  );
};

export default Scanner;
