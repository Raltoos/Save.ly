import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/mobile-app.png";

const Landing = () => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!clicked) {
      setClicked(true);
      setTimeout(() => navigate("/app/home"), 800);
    }
  };

  return (
    <div
      className="relative w-screen h-screen bg-gradient-to-b from-[#429690] to-[#2A7C76] flex flex-col items-center justify-center gap-6 text-center text-white overflow-hidden px-6"
      onClick={handleClick}
    >
      <motion.img 
        src={logo} 
        alt="App Logo" 
        className="w-[70%] max-w-[18rem] md:w-[18rem] z-0"
        initial={{ y: -10}}
        animate={{ y: [0, -5, 0]}}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      />
      
      <h1 className="text-4xl md:text-5xl font-bold z-10">Save.ly</h1>
      <p className="text-lg md:text-xl z-10">Spend Smart. Save Smart.</p>

      {!clicked && (
        <motion.p
          className="absolute bottom-16 text-white text-sm md:text-base opacity-70 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Tap anywhere to continue
        </motion.p>
      )}

      {clicked && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute w-32 h-32 bg-white rounded-full"
        />
      )}
    </div>
  );
};

export default Landing;
