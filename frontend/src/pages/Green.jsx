import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaLeaf, FaSeedling, FaRecycle, FaTree } from "react-icons/fa";
import { IoEarth } from "react-icons/io5";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ==================================================
// LOADER COMPONENT (PARTIAL LOADER FOR GREEN STOCKS)
// ==================================================
const Loader = () => {
  // A simple rotating loader ring using Tailwind
  // You can customize size, colors, etc.
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

// Endpoint for fetching green stocks
const GREEN_STOCKS_API = "http://localhost:5050/api/greenstocks";

const Green = () => {
  const navigate = useNavigate();
  const transactions = useSelector((state) => state.trxns.transactions);

  // Loader state just for green stocks section
  const [loadingGreenStocks, setLoadingGreenStocks] = useState(true);

  // The array of green stocks
  const [greenStocks, setGreenStocks] = useState([]);

  // Other states (analytics, etc.)
  const [totalSavings, setTotalSavings] = useState(0);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [savingsByCategory, setSavingsByCategory] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [trees, setTrees] = useState(0);
  const [offsetCO2, setOffsetCO2] = useState(0);

  // ================================================
  // 1) On mount, check localStorage for greenStocks.
  //    If absent, fetch from API. Then set loading false.
  // ================================================
  useEffect(() => {
    const localData = localStorage.getItem("greenStocks");
    if (localData) {
      console.log("Loaded green stocks from localStorage");
      setGreenStocks(JSON.parse(localData));
      setLoadingGreenStocks(false);
    } else {
      console.log("No local greenStocks found, fetching from API...");
      fetch(GREEN_STOCKS_API)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch green stocks");
          return res.json();
        })
        .then((data) => {
          // data => { status: "success", data: { green_stocks: [...] } }
          if (data.status === "success" && data.data?.green_stocks) {
            const stocksArray = data.data.green_stocks;
            // Save to localStorage
            localStorage.setItem("greenStocks", JSON.stringify(stocksArray));
            // Update state
            setGreenStocks(stocksArray);
          } else {
            console.error("API returned unexpected data:", data);
          }
          // Done loading either way
          setLoadingGreenStocks(false);
        })
        .catch((error) => {
          console.error("Error fetching green stocks:", error);
          setLoadingGreenStocks(false);
        });
    }
  }, []);

  // ================================================
  // 2) Whenever transactions change, recalc totals
  // ================================================
  useEffect(() => {
    const savings = transactions.reduce(
      (total, t) => total + t.savingAmount,
      0
    );
    setTotalSavings(savings);

    const treeCost = 750;
    const computedTrees = Math.floor(savings / treeCost);
    setTrees(computedTrees);
    setOffsetCO2(computedTrees * 21);

    let carbon = 0;
    transactions.forEach((t) => {
      switch (t.category) {
        case "Food & Dining":
          carbon += t.amount * 0.00025;
          break;
        case "Transport":
          carbon += t.amount * 0.00065;
          break;
        case "Shopping":
          carbon += t.amount * 0.00035;
          break;
        case "Household":
          carbon += t.amount * 0.0005;
          break;
        default:
          carbon += t.amount * 0.0002;
      }
    });
    setCarbonFootprint(Math.round(carbon));

    const categorySavings = {};
    transactions.forEach((t) => {
      if (!categorySavings[t.category]) {
        categorySavings[t.category] = 0;
      }
      categorySavings[t.category] += t.savingAmount;
    });
    const categoryData = Object.keys(categorySavings).map((cat) => ({
      name: cat,
      value: categorySavings[cat],
    }));
    setSavingsByCategory(categoryData);

    const months = {};
    transactions.forEach((t) => {
      const month = t.date.substring(0, 7);
      if (!months[month]) months[month] = 0;
      months[month] += t.savingAmount;
    });
    const monthlyTrend = Object.keys(months)
      .sort()
      .map((m) => {
        const [year, monthNum] = m.split("-");
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return {
          month: monthNames[parseInt(monthNum) - 1],
          savings: months[m],
        };
      });
    setMonthlyData(monthlyTrend);
  }, [transactions]);

  // Chart colors
  const COLORS = ["#429690", "#2A7C76", "#1D5C57", "#5DB5AF", "#70C5BF"];

  // ================================================
  //              RENDER COMPONENT
  // ================================================
  return (
    <div className="w-full h-full flex flex-col overflow-hidden overflow-y-auto pb-24 items-center">
      {/* ====== HEADER ====== */}
      <div className="relative top-0 z-10 bg-gradient-to-b from-[#429690] to-[#2A7C76] w-full h-[150px] text-white flex items-start py-[2rem] px-4">
        <div className="flex justify-between items-center w-full h-[85%]">
          <MdOutlineKeyboardArrowLeft
            className="text-3xl cursor-pointer"
            onClick={() => navigate("/app/home")}
          />
          <p className="text-xl font-semibold">Green Finance</p>
          <BsThreeDots className="text-3xl" />
        </div>
      </div>

      {/* ====== CONTENT WRAPPER ====== */}
      <div className="absolute mt-[8rem] max-w-[900px] w-screen bg-white rounded-t-[1.4rem] z-10 flex flex-col px-4 pt-6 flex-grow overflow-hidden overflow-y-auto items-center shadow-lg">
        {/* ====== SUMMARY SECTION ====== */}
        <div className="flex justify-between w-full mb-6 mt-2">
          <div className="flex flex-col">
            <span className="text-gray-500 font-normal text-sm">
              Total Savings
            </span>
            <span className="font-semibold text-2xl text-[#429690]">
              ₹ {totalSavings}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500 font-normal text-sm">
              Carbon Footprint
            </span>
            <span className="font-semibold text-lg text-[#429690]">
              {carbonFootprint} Kg CO₂
            </span>
          </div>
        </div>

        {/* ====== GREEN IMPACT CARD ====== */}
        <div className="max-w-[400px] w-full bg-gradient-to-r from-[#429690] to-[#2A7C76] rounded-xl p-4 text-white mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold mb-1">Your Green Impact</h2>
              <p className="text-xs opacity-90">
                Based on your current savings
              </p>
              <div className="mt-3">
                <p className="text-xl font-bold">{trees} Trees</p>
                <p className="text-xs">Offset ~{offsetCO2} Kg CO₂/year</p>
              </div>
            </div>
            <div className="flex items-center justify-center bg-white bg-opacity-20 w-16 h-16 rounded-full">
              <FaRecycle className="text-2xl" />
            </div>
          </div>
          <button className="w-full bg-white text-[#429690] py-2 rounded-lg mt-3 font-semibold text-sm">
            Increase Your Impact
          </button>
        </div>

        {/* ====== SAVINGS IMPACT CHARTS ====== */}
        <div className="w-full bg-gray-50 rounded-xl p-3 mb-5 shadow-sm">
          <h2 className="text-base font-semibold text-[#2A7C76] mb-2">
            Your Savings Impact
          </h2>
          <div className="h-[180px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={savingsByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name }) => name.split(" ")[0]}
                >
                  {savingsByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, "Savings"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <h3 className="text-sm font-medium text-[#2A7C76] mb-2">
            Monthly Savings Trend
          </h3>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={25} />
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Savings"]}
                  labelStyle={{ fontSize: 12 }}
                  contentStyle={{ fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#429690"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ====== GREEN STOCKS SECTION ====== */}
        <div className="w-full mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-[#2A7C76]">
              Offset Your Carbon
            </h2>
            <span className="text-xs text-[#429690] font-medium">View All</span>
          </div>

          {/* Only show loader for green stocks area */}
          <div className="space-y-3">
            {loadingGreenStocks ? (
              <Loader />
            ) : Array.isArray(greenStocks) ? (
              greenStocks.map((stock) => (
                <div
                  key={stock.id}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: stock.color }}
                    >
                      <FaTree className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{stock.name}</h3>
                      <p className="text-xs text-gray-500">
                        {stock.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-[#429690]">
                      {stock.return}
                    </p>
                    <p className="text-xs text-gray-500">{stock.impact}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No green stocks available</p>
            )}
          </div>
        </div>

        {/* ====== SMART MONEY TIPS ====== */}
        <div className="w-full mb-6">
          <h2 className="text-base font-semibold text-[#2A7C76] mb-3">
            Smart Money Tips
          </h2>
          <div className="space-y-3">
            {[
              {
                id: 1,
                title: "Round-Up Savings Strategy",
                description:
                  "Enable round-ups on all transactions to save an extra ₹3000 yearly without noticing.",
                icon: <FaSeedling className="text-2xl text-[#429690]" />,
              },
              {
                id: 2,
                title: "Carbon Offset Investing",
                description:
                  "Invest 2% of your savings in carbon offset projects for maximum environmental impact.",
                icon: <IoEarth className="text-2xl text-[#429690]" />,
              },
              {
                id: 3,
                title: "Green Daily Habits",
                description:
                  "Small changes like reusable bottles can save ₹5000 yearly and reduce your carbon footprint.",
                icon: <FaLeaf className="text-2xl text-[#429690]" />,
              },
            ].map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-50 rounded-full flex-shrink-0">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-[#2A7C76]">
                      {tip.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ====== WEEKLY CHALLENGES ====== */}
        <div className="w-full mb-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-[#2A7C76]">
              Weekly Challenges
            </h2>
            <span className="text-xs text-[#429690] font-medium">See More</span>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 pb-10 mb-10">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm">No-Shopping Weekend</h3>
              <span className="text-xs font-bold text-[#429690]">
                +500 Points
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Avoid non-essential purchases this weekend to reduce your carbon
              footprint
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className="bg-[#429690] h-2 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">2/5 Days</span>
              <span className="text-xs font-medium text-[#429690]">
                45% Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Green;
