import { NavLink } from "react-router-dom";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { HiOutlineCreditCard, HiCreditCard } from "react-icons/hi";
import { IoPersonOutline, IoPerson } from "react-icons/io5";
import { MdInsertChart, MdInsertChartOutlined } from "react-icons/md";

const BottomNav = () => {
  return (
    <nav className="fixed z-50 bottom-0 w-full bg-white shadow-md border-t border-gray-300 py-4">
      <div className="flex justify-around items-center">
        <NavItem to="/app/home" Icon={AiOutlineHome} ActiveIcon={AiFillHome} />
        <NavItem to="/app/analytics" Icon={MdInsertChartOutlined} ActiveIcon={MdInsertChart} />
        <NavItem to="/app/green" Icon={HiOutlineCreditCard} ActiveIcon={HiCreditCard} />
        <NavItem to="/app/profile" Icon={IoPersonOutline} ActiveIcon={IoPerson} />
      </div>
    </nav>
  );
};

// eslint-disable-next-line no-unused-vars
const NavItem = ({ to, Icon, ActiveIcon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group flex flex-col items-center text-gray-500 text-2xl transition-colors ${
        isActive ? "text-[#2F7E79]" : "text-gray-500"
      }`
    }
  >
    {({ isActive }) => (
      <span className="fill-current">
        {isActive ? <ActiveIcon className="text-[#2F7E79]" /> : <Icon />}
      </span>
    )}
  </NavLink>
);

export default BottomNav;
