import { useNavigate } from "react-router-dom";
import { GetRoomCreateRes } from "../utils/ServerAPIs";

const Room = () => {
  const navigate = useNavigate();

  GetRoomCreateRes().then((url) => {
    navigate(url);
  });

  return <></>;
};

export default Room;
