import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const EditorComponent = (props: { ChatWebsocketAddr: string }) => {
  const [websocket, setWebsocket] = useState<WebSocket>();
  const editorRef = useRef(null);

  console.log(props.ChatWebsocketAddr);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    // alert(editorRef?.current?.getValue());
    websocket?.send(
      JSON.stringify({
        event: "editor-change",
        data: editorRef?.current?.getValue() || "",
      })
    );
  }

  const EstablishWS = () => {
    console.log(props.ChatWebsocketAddr);
    const websocket = new WebSocket(props.ChatWebsocketAddr);

    setWebsocket(websocket);

    websocket.addEventListener("error", function (error) {
      console.log("Error in code editor websocket", error);
    });

    websocket.onclose = function () {
      console.log("Websocket has closed");
    };

    websocket.onmessage = function (event) {
      const msg = JSON.parse(event.data);

      if (!msg) {
        console.log("Failed to parse message in code editor");
      }

      console.log(msg);

      switch (msg.event) {
        case "editor-change": {
          editorRef?.current?.getModel().setValue("test");
        }
      }
    };
  };

  useEffect(() => {
    console.log("here");
    EstablishWS();
  }, []);

  return (
    <>
      <button onClick={showValue}>Show value</button>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="console.log('Hello World')"
        onMount={handleEditorDidMount}
      />
    </>
  );
};

export default EditorComponent;
