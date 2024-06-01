import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const EditorComponent = (props: { ChatWebsocketAddr: string }) => {
  const [websocket, setWebsocket] = useState<WebSocket>();
  const editorRef = useRef(null);

  const [editorChangeReceived, setEditorChangeReceived] = useState<string>("");

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value, event) {
    const editorValue: string = editorRef?.current?.getValue() || "";

    if (0 == editorValue.localeCompare(editorChangeReceived)) {
      return;
    }

    websocket?.send(
      JSON.stringify({
        event: "editor-change",
        data: editorValue,
      })
    );
  }

  const EstablishWS = () => {
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

      switch (msg.event) {
        case "editor-change": {
          setEditorChangeReceived(msg.data);
        }
      }
    };
  };

  useEffect(() => {
    EstablishWS();
  }, []);

  useEffect(() => {
    editorRef?.current?.setValue(editorChangeReceived);
  }, [editorChangeReceived]);

  return (
    <>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="console.log('Hello World')"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </>
  );
};

export default EditorComponent;
