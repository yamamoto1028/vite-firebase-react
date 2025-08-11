import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import UpdatePassword from "./components/UpdatePassword";
import SendReset from "./components/SendReset";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/updatePassword" element={<UpdatePassword />}></Route>
      <Route path="/sendReset" element={<SendReset />}></Route>
    </Routes>
  );
}

export default App;
