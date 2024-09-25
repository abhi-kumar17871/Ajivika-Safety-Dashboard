import SensorData from "./components/SensorData";

const App = () => {
  return (
    <div>
      <div className="flex w-full fixed justify-center bg-black font-bold text-white p-5 text-3xl z-10">
        AJIVIKA SAFETY DASHBOARD
      </div>
      <div className="pt-16">
        <SensorData />
      </div>
    </div>
  );
};

export default App;
