import axios from "axios";

export const GetWSDetails = async (path: string): Promise<string> => {
  let RoomWebsocketAddr: string;

  try {
    const response = await axios.get(`http://localhost:8080${path}`);
    RoomWebsocketAddr = response.data.RoomWebsocketAddr;
  } catch (error) {
    console.log("Error in fetching websocket details", error);
    RoomWebsocketAddr = "";
  }

  console.log(RoomWebsocketAddr);

  return RoomWebsocketAddr;
};

export const GetRoomCreateRes = async (): Promise<string> => {
  const res = await axios.get("http://localhost:8080/room/create");
  return res.data.url;
};
