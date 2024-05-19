import axios from "axios";
import { useNavigate } from "react-router-dom";

const Room = () => {
  // fetch("/room/create")
  //   .then((response) => {
  //     console.log(response);
  //     response.json();
  //   })
  //   .then((data) => console.log(data));
  const navigate = useNavigate();

  axios.get("http://localhost:8080/room/create").then((response) => {
    let RoomWebsocketAddr: string;
    axios
      .get(`http://localhost:8080${response.data.url}`)
      .then((response) => {
        console.log(response);
        RoomWebsocketAddr = response.data.RoomWebsocketAddr;
      })
      .then(() => {
        navigate(response.data.url, {
          state: { RoomWebsocketAddr },
        });
      });
  });

  return <></>;
};

export default Room;
