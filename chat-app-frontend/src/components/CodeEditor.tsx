import { Editor } from "@monaco-editor/react";

const EditorComponent = () => {
  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="console.log('Hello World')"
    />
  );
};

export default EditorComponent;
