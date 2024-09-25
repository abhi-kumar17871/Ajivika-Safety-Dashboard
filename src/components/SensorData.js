// src/components/SensorData.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";
import LineGraph from "./LineGraph";
import Speedometer from "./Speedometer";
import GasConcentrationBar from "./GasConcentrationBar";

const SensorData = () => {
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [pastTemperatures, setPastTemperatures] = useState([]);
  const [currentHumidity, setCurrentHumidity] = useState(null);
  const [pastHumidity, setPastHumidity] = useState([]);
  const [currentLPG, setCurrentLPG] = useState(null);
  const [pastLPG, setPastLPG] = useState([]);
  const [currentH2S, setCurrentH2S] = useState(null);
  const [pastH2S, setPastH2S] = useState([]);
  const [dateLabel, setDateLabel] = useState("");
  const threshold = 32;

  useEffect(() => {
    const sensorRef = ref(db, "/sensor_data");
    onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tempArray = Object.values(data).slice(-5);
        const latestRecord = tempArray[tempArray.length - 1];
        setCurrentTemperature(latestRecord.temperature);
        setPastTemperatures(tempArray);
        setCurrentHumidity(latestRecord.humidity);
        setPastHumidity(tempArray);
        setCurrentLPG(latestRecord.LPG);
        setPastLPG(tempArray);
        setCurrentH2S(latestRecord.H2S);
        setPastH2S(tempArray);

        const latestTimestamp = latestRecord.timestamp;
        const [date] = latestTimestamp.split(" ");
        setDateLabel(date);

        if (latestRecord.temperature > threshold) {
          alert(
            `Warning! Temperature exceeded threshold: ${latestRecord.temperature}°C`
          );
        }
      }
    });
  }, []);

  const [concentration, setConcentration] = useState(75);

  const handleChange = (e) => {
    setConcentration(e.target.value);
  };

  const handleAlertClick = () => {
    const buttonRef = ref(db, '/button_state');
    
    // Update the value in Firebase
    set(buttonRef, true)
      .then(() => {
        console.log('Alert triggered, button state set to true');
      })
      .catch((error) => {
        console.error('Error setting button state: ', error);
      });
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 pt-10 grid-cols-1 font-semibold text-2xl">
        <div className="p-14">
          <div className="flex justify-center p-5 font-bold text-3xl border border-black">
            Current Concentration
          </div>
          <h2 className="p-2 border border-black">
            Temperature: {currentTemperature}°C
          </h2>
          <h2 className="p-2 border border-black">
            Humidity: {currentHumidity}
          </h2>
          <h2 className="p-2 border border-black">Gas Concentration:</h2>
          <h2 className="pl-10 p-2 border border-black">
            -LPG: {currentLPG} ppm
          </h2>
          <h2 className="pl-10 p-2 border border-black">
            -Hydrogen Sulphide: {currentH2S} ppm
          </h2>
          <div className="pt-10">
            <GasConcentrationBar concentration={concentration} />
          </div>
          <div className="pt-10">
           <button onClick={handleAlertClick} className="border border-black p-2 w-full text-white bg-black rounded-md">ALERT THE WORKER</button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1">
          <Speedometer
            label="Temperature (°C)"
            value={currentTemperature}
            maxValue={50}
          />
          <Speedometer
            label="Humidity"
            value={currentHumidity}
            maxValue={100}
          />
          <Speedometer
            label="LPG Conc. (ppm)"
            value={currentLPG}
            maxValue={1000}
          />
          <Speedometer
            label="Hydrogen Sulphide Conc. (ppm)"
            value={currentH2S}
            maxValue={50}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 px-20 pb-10">
        <div className="p-2">
          <LineGraph
            pastValues={pastTemperatures}
            dateLabel={dateLabel}
            label="Temperature (°C)"
            type="temperature"
          />
        </div>
        <div className="p-2">
          <LineGraph
            pastValues={pastHumidity}
            dateLabel={dateLabel}
            label="Humidity"
            type="humidity"
          />
        </div>
        <div className="p-2">
          <LineGraph
            pastValues={pastLPG}
            dateLabel={dateLabel}
            label="LPG Concentration (ppm)"
            type="LPG"
          />
        </div>
        <div className="p-2">
          <LineGraph
            pastValues={pastH2S}
            dateLabel={dateLabel}
            label="Hydrogen Sulphide Concentration (ppm)"
            type="H2S"
          />
        </div>
      </div>
    </div>
  );
};

export default SensorData;
