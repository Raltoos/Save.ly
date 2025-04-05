import Landing from "./pages/Landing";
import Overlay from "./pages/Overlay";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Green from "./pages/Green";
import Wrapper from "./pages/Wrapper";
import AddExpense from "./pages/AddExpense";
import QRAnimation from "./pages/QRAnimation";
import TrxnFinish from "./components/TrxnFinish";
import TrxnDetail from "./pages/TrxnDetail";

const routes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/app",
    element: <Wrapper />,
    children: [
      {
        path: "",
        element: <Overlay />,
        children: [
          {
            path: "home",
            element: <Home />,
          },
          {
            path: "analytics",
            element: <Analytics />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "green",
            element: <Green />,
          },
        ],
      },
      {
        path: "new_transaction",
        element: <AddExpense />,
      },
      {
        path: "QRScan",
        element: <QRAnimation />,
      },
      {
        path: "trxn_success",
        element: <TrxnFinish />,
      },
      {
        path: "trxn_details",
        element: <TrxnDetail />,
      },
    ],
  },
];

export default routes;
