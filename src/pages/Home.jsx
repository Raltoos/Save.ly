import { FaBell } from "react-icons/fa";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/home/StatsCard";
import TrxHistory from "../components/home/TrxHistory";

const Home = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [total, setTotal] = useState(0);
  const [savings, setSavings] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="relative w-screen flex flex-col items-center bg-gray-100 text-white overflow-hidden overflow-y-auto pb-20">
      <div className="absolute bg-gradient-to-b from-[#429690] to-[#2A7C76] w-screen h-[250px] rounded-b-[20%] flex items-start justify-between p-5">
        <div className="flex flex-col">
          <p className="text-sm font-light">Good Evening,</p>
          <p className="text-xl font-semibold">Anuj Parwal</p>
        </div>
        <button className="text-white text-xl bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
          <FaBell />
        </button>
      </div>

      <StatsCard
        total={total}
        savings={savings}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      <TrxHistory setTotal={setTotal} selectedPeriod={selectedPeriod} setSavings={setSavings}/>

      <button className="fixed bottom-16 p-4 bg-[#2F7E79] rounded-full text-2xl" onClick={()=>navigate('/app/QRScan')}>
        <MdOutlineQrCodeScanner />
      </button>
    </div>
  );
};

export default Home;
