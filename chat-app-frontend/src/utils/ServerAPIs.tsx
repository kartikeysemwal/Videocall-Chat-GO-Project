import axios from "axios";

export interface WSDetailsRes {
  RoomWebsocketAddr: string;
  ChatWebsocketAddr: string;
}

export const GetWSDetails = async (path: string): Promise<WSDetailsRes> => {
  const res: WSDetailsRes = {
    RoomWebsocketAddr: "",
    ChatWebsocketAddr: "",
  };

  try {
    const response = await axios.get(`http://localhost:8080${path}`);
    res.RoomWebsocketAddr = response.data.RoomWebsocketAddr;
    res.ChatWebsocketAddr = response.data.ChatWebsocketAddr;
  } catch (error) {
    console.log("Error in fetching websocket details", error);
  }

  return res;
};

export const GetRoomCreateRes = async (): Promise<string> => {
  const res = await axios.get("http://localhost:8080/room/create");
  return res.data.url;
};
