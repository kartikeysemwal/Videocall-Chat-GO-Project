import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { GetWSDetails } from "../utils/ServerAPIs";

const Peer = () => {
  const [RoomWebsocketAddr, setRoomWebsocketAddr] = useState<string>("");
  const { RoomWebsocketAddr: RoomWebsocketAddrFromParams } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const res = await GetWSDetails(`/room/${RoomWebsocketAddrFromParams}`);
      setRoomWebsocketAddr(res);
    };

    fetchData();
  }, [RoomWebsocketAddrFromParams]);

  //   const [stream, setStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const noPermRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);
  const nooneRef = useRef<HTMLDivElement>(null);
  const nooneInRef = useRef<HTMLDivElement>(null);
  const noConRef = useRef<HTMLDivElement>(null);

  const connect = (stream: MediaStream) => {
    if (peersRef.current) {
      peersRef.current.style.display = "block";
    }
    if (chatRef.current) {
      chatRef.current.style.display = "flex";
    }
    if (noPermRef.current) {
      noPermRef.current.style.display = "none";
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // {
        //   urls: "stun:turn:videochat:3478",
        // },
        // {
        //   urls: "turn:turn:videochat:3478",
        //   username: "kartikey",
        //   credential: "kartikey",
        // },
      ],
    });

    pc.ontrack = function (event) {
      if (event.track.kind != "video") {
        return;
      }

      const col = document.createElement("div");
      col.className = "column is-6 peer";
      const el = document.createElement(event.track.kind);
      el.srcObject = event.streams[0];
      el.setAttribute("controls", "true");
      el.setAttribute("autoplay", "true");
      el.setAttribute("playsinline", "true");
      col.appendChild(el);

      if (nooneRef.current) {
        nooneRef.current.style.display = "none";
      }
      if (noConRef.current) {
        noConRef.current.style.display = "none";
      }
      if (videosRef.current) {
        videosRef.current.appendChild(col);
      }

      event.track.onmute = function () {
        el.play();
      };

      event.streams[0].onremovetrack = () => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }

        if (videosRef.current && videosRef.current.childElementCount <= 3) {
          if (nooneRef.current) {
            nooneRef.current.style.display = "grid";
          }
          if (nooneInRef.current) {
            nooneInRef.current.style.display = "grid";
          }
        }
      };
    };

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    const websocket = new WebSocket(RoomWebsocketAddr ?? "");

    pc.onicecandidate = (e) => {
      if (!e.candidate) {
        return;
      }

      websocket.send(
        JSON.stringify({
          event: "candidate",
          data: JSON.stringify(e.candidate),
        })
      );
    };

    websocket.addEventListener("error", function (event) {
      console.log("error:", event);
    });

    websocket.onclose = function () {
      console.log("websocket has closed");
      pc.close();
      //   pc = null;

      if (videosRef.current) {
        while (videosRef.current.childElementCount > 3) {
          videosRef.current.lastChild?.remove();
        }
      }

      if (nooneRef.current) {
        nooneRef.current.style.display = "none";
      }
      if (noConRef.current) {
        noConRef.current.style.display = "flex";
      }

      setTimeout(function () {
        connect(stream);
      }, 1000);
    };

    websocket.onmessage = function (event) {
      const msg = JSON.parse(event.data);
      if (!msg) {
        return console.log("failed to parse msg");
      }
      const pattern = /o=.*\r\n/;

      switch (msg.event) {
        case "offer": {
          const offer = JSON.parse(msg.data);

          if (!offer) {
            return console.log("failed to parse error");
          }

          const matches1 = offer.sdp.match(pattern);
          console.log("kar-test received offer", matches1[0]);

          pc.setRemoteDescription(offer);
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            websocket.send(
              JSON.stringify({
                event: "answer",
                data: JSON.stringify(answer),
              })
            );

            if (answer.sdp) {
              const matches2 = answer.sdp.match(pattern);
              console.log("kart-test sent answer", matches2?.[0]);
            }
          });

          return;
        }

        case "candidate": {
          const candidate = JSON.parse(msg.data);
          if (!candidate) {
            return console.log("failed to parse candidate");
          }

          pc.addIceCandidate(candidate);
        }
      }
    };

    websocket.onerror = function (event) {
      console.log("error:", event);
    };
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { max: 1280 },
          height: { max: 720 },
          aspectRatio: 4 / 3,
          frameRate: 30,
        },
        audio: {
          sampleSize: 16,
          sampleRate: 8000,
          echoCancellation: true,
        },
      })
      .then((stream) => {
        // setStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        connect(stream);
      })
      .catch((error) => console.log(error));
  }, [RoomWebsocketAddr]);

  return (
    <div>
      <video id="localVideo" ref={localVideoRef} autoPlay playsInline></video>
      <div id="peers" ref={peersRef} style={{ display: "none" }}></div>
      <div id="chat" ref={chatRef} style={{ display: "none" }}></div>
      <div id="noperm" ref={noPermRef} style={{ display: "block" }}></div>
      <div id="videos" ref={videosRef}></div>
      <div id="noone" ref={nooneRef} style={{ display: "none" }}></div>
      <div id="noonein" ref={nooneInRef} style={{ display: "none" }}></div>
      <div id="nocon" ref={noConRef} style={{ display: "none" }}></div>
    </div>
  );
};

export default Peer;
