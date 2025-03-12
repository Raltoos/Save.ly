import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "./routes";

const App = () => {
  const routings = createBrowserRouter(routes);

  return <RouterProvider router={routings}></RouterProvider>;
};

export default App;
