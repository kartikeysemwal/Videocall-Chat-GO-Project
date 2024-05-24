import "./assets/main.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Peer from "./components/Peer";
import Room from "./components/Room";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/room/create" Component={Room} />
        <Route path="/room/:RoomWebsocketAddr" element={<Peer />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
