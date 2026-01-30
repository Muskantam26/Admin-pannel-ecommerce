import "./App.css";
import Sidebar from "./Component/Sidebar";
import Header from "./Component/Header";
import Home from "./page/Home";

function App() {
  return (
    <div className="flex gap-6 p-6 bg-(--bg-main) min-h-screen ">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <Home/>
      </div>
      
    </div>
  );
}

export default App;
