import React, { useEffect, useState } from "react";
import Quagga from "quagga";

export const Scanner = () => {
    const [codeScanned, setCodeScanned] = useState(0);

    const initScan = () => {
        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: document.querySelector("#reader"), // Or '#yourElement' (optional)
            },
            decoder: {
              readers: [
                "ean_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader",
                "i2of5_reader",
                "2of5_reader",
                "code_93_reader",
              ],
            },
          },
          function (err) {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
            Quagga.OnDetected((data) => {
              showCode(data);
            });
          }
        );
      };
      
      const showCode = (code) => {
        console.log("Este es el codigo: ", code);
        setCodeScanned(data);
      };

  return (
    <div>
      <h1>Scanner</h1>
      <button
        onClick={() => {
          initScan();
        }}
      >
        Activar Camara
      </button>
      <div id="reader"></div>
      <h1>{codeScanned}</h1>
    </div>
  );
};
