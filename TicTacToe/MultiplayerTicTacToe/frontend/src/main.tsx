import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Lobby from "./pages/lobby";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Play from "./Play";

const router = createBrowserRouter([
  {
    path: "/Play",
    element: <Play />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/lobby",
    element: <Lobby />,
  },
  {
    path: "/game/:gameId",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// <React.StrictMode>
//     <App />
//   </React.StrictMode>
