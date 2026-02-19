import { BrowserRouter } from "react-router-dom";
import "./App.css";


import AppRoutes from "./Routes/AppRoutes";
import { useEffect } from "react";
import { MainContent } from "./constant/MainContent";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import PageLoader from "./Component/PageLoader";


function App() {

  const { isLoading } = useSelector((state) => state.loading);

  useEffect(() => {
    let faviconLink =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");

    faviconLink.rel = "icon";
    faviconLink.href = MainContent.appFavicon;
    document.head.appendChild(faviconLink);
  }, []);




  return (
    <BrowserRouter>
      {isLoading && <PageLoader />}
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
