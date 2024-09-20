import Sidebar from "./Components/Sidebar/Sidebar";
import LandingPage from "./Components/Landing_Page/Landing_Page";

import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return ( 
    <BrowserRouter>
    <div className="App">
    <Routes>
   
    <Route path="/" element={<LandingPage/>}></Route> 
    <Route path = "/dashboard" element = {<Sidebar/>}></Route>

    </Routes>
      
    </div>
    </BrowserRouter>
  );
}

export default App;
