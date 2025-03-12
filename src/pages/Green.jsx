import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaLeaf, FaSeedling, FaRecycle, FaTree } from "react-icons/fa";
import { IoEarth } from "react-icons/io5";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Green = () => {
  const navigate = useNavigate();
  const transactions = useSelector((state) => state.trxns.transactions);
  const [totalSavings, setTotalSavings] = useState(0);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [savingsByCategory, setSavingsByCategory] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const savings = transactions.reduce((total, transaction) => {
      return total + transaction.savingAmount;
    }, 0);
    setTotalSavings(savings);

    let carbon = 0;
    transactions.forEach(transaction => {
      switch (transaction.category) {
        case "Food & Dining":
          carbon += transaction.amount * 0.0002; // kg CO2 per rupee
          break;
        case "Transport":
          carbon += transaction.amount * 0.0005; 
          break;
        case "Shopping":
          carbon += transaction.amount * 0.0003;
          break;
        case "Household":
          carbon += transaction.amount * 0.0004;
          break;
        default:
          carbon += transaction.amount * 0.0001;
      }
    });
    setCarbonFootprint(Math.round(carbon));

    // Calculate savings by category for pie chart
    const categorySavings = {};
    transactions.forEach(transaction => {
      if (!categorySavings[transaction.category]) {
        categorySavings[transaction.category] = 0;
      }
      categorySavings[transaction.category] += transaction.savingAmount;
    });
    
    const categoryData = Object.keys(categorySavings).map(category => ({
      name: category,
      value: categorySavings[category]
    }));
    setSavingsByCategory(categoryData);

    // Prepare monthly savings data for line chart
    const months = {};
    transactions.forEach(transaction => {
      const month = transaction.date.substring(0, 7); // YYYY-MM
      if (!months[month]) {
        months[month] = 0;
      }
      months[month] += transaction.savingAmount;
    });
    
    const monthlyTrend = Object.keys(months).sort().map(month => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        month: monthNames[parseInt(monthNum) - 1],
        savings: months[month]
      };
    });
    setMonthlyData(monthlyTrend);
  }, [transactions]);

  // Mock data for green investment options
  const greenStocks = [
    {
      id: 1,
      name: "EcoSolar Inc.",
      ticker: "ESOL",
      return: "+12.8%",
      impact: "Reduced 1.2M tons CO2",
      description: "Leading solar panel manufacturer",
      color: "#429690"
    },
    {
      id: 2,
      name: "WindPower Global",
      ticker: "WIND",
      return: "+8.6%",
      impact: "Carbon negative operations",
      description: "Offshore wind farm development",
      color: "#30706A"
    },
    {
      id: 3,
      name: "GreenTech Solutions",
      ticker: "GTEC",
      return: "+15.2%",
      impact: "Saved 800K tons CO2",
      description: "Sustainable technology innovation",
      color: "#2A7C76"
    }
  ];

  // Mock data for financial tips
  const financialTips = [
    {
      id: 1,
      title: "Round-Up Savings Strategy",
      description: "Enable round-ups on all transactions to save an extra ₹3000 yearly without noticing.",
      icon: <FaSeedling className="text-2xl text-[#429690]" />
    },
    {
      id: 2,
      title: "Carbon Offset Investing",
      description: "Invest 2% of your savings in carbon offset projects for maximum environmental impact.",
      icon: <IoEarth className="text-2xl text-[#429690]" />
    },
    {
      id: 3,
      title: "Green Daily Habits",
      description: "Small changes like reusable bottles can save ₹5000 yearly and reduce your carbon footprint.",
      icon: <FaLeaf className="text-2xl text-[#429690]" />
    }
  ];

  const COLORS = ['#429690', '#2A7C76', '#1D5C57', '#5DB5AF', '#70C5BF'];

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 overflow-hidden overflow-y-auto pb-24">
      <div className="relative top-0 z-10 bg-gradient-to-b from-[#429690] to-[#2A7C76] w-full h-[150px] text-white flex items-start py-[2rem] px-4">
        <div className="flex justify-between items-center w-full">
          <MdOutlineKeyboardArrowLeft
            className="text-3xl cursor-pointer"
            onClick={() => navigate("/app/home")}
          />
          <p className="text-xl font-semibold">Green Finance</p>
          <BsThreeDots className="text-3xl" />
        </div>
      </div>

      <div className="absolute mt-[6rem] w-screen bg-white rounded-t-[4rem] z-10 flex flex-col px-4 pt-6 flex-grow overflow-y-auto">
        {/* Summary numbers */}
        <div className="flex justify-between w-full mb-6 mt-2">
          <div className="flex flex-col">
            <span className="text-gray-500 font-normal text-sm">Total Savings</span>
            <span className="font-semibold text-2xl text-[#429690]">₹ {totalSavings}</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-gray-500 font-normal text-sm">Carbon Footprint</span>
            <span className="font-semibold text-lg text-[#429690]">{carbonFootprint} Kg CO2</span>
          </div>
        </div>

        {/* Environmental Impact Summary Card */}
        <div className="w-full bg-gradient-to-r from-[#429690] to-[#2A7C76] rounded-xl p-4 text-white mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold mb-1">Your Green Impact</h2>
              <p className="text-xs opacity-90">Based on your current savings</p>
              
              <div className="mt-3">
                <p className="text-xl font-bold">12 Trees</p>
                <p className="text-xs">Carbon offset equivalent</p>
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

        <div className="w-full bg-gray-50 rounded-xl p-3 mb-5 shadow-sm">
          <h2 className="text-base font-semibold text-[#2A7C76] mb-2">Your Savings Impact</h2>
          
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
                  label={({name}) => name.split(' ')[0]}
                >
                  {savingsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Savings']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <h3 className="text-sm font-medium text-[#2A7C76] mb-2">Monthly Savings Trend</h3>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={25} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Savings']} labelStyle={{ fontSize: 12 }} contentStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="savings" stroke="#429690" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-[#2A7C76]">Offset Your Carbon</h2>
            <span className="text-xs text-[#429690] font-medium">View All</span>
          </div>
          
          <div className="space-y-3">
            {greenStocks.map(stock => (
              <div key={stock.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: stock.color }}>
                    <FaTree className="text-white text-sm" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{stock.name}</h3>
                    <p className="text-xs text-gray-500">{stock.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-[#429690]">{stock.return}</p>
                  <p className="text-xs text-gray-500">{stock.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mb-6">
          <h2 className="text-base font-semibold text-[#2A7C76] mb-3">Smart Money Tips</h2>
          
          <div className="space-y-3">
            {financialTips.map(tip => (
              <div key={tip.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-50 rounded-full flex-shrink-0">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-[#2A7C76]">{tip.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full mb-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-[#2A7C76]">Weekly Challenges</h2>
            <span className="text-xs text-[#429690] font-medium">See More</span>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm">No-Shopping Weekend</h3>
              <span className="text-xs font-bold text-[#429690]">+500 Points</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Avoid non-essential purchases this weekend to reduce your carbon footprint</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div className="bg-[#429690] h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">2/5 Days</span>
              <span className="text-xs font-medium text-[#429690]">45% Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Green;