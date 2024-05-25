import "./assets/main.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Peer from "./components/Peer";
import Room from "./components/Room";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditorComponent from "./components/CodeEditor";

function App() {
  return (
    <Router>
      <div className="full-body">
        <Header />
        <div className="main-component">
          <div className="editor-component">
            <EditorComponent />
          </div>
          <div className="video-component">
            <Routes>
              <Route path="/room/create" Component={Room} />
              <Route path="/room/:RoomWebsocketAddr" element={<Peer />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
