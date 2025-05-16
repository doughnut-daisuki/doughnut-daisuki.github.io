import { useState } from "react";
import CanvasPreview from "./components/CanvasPreview";
import CharacterForm from "./components/CharacterForm";
import type { ExplorerData } from "./components/types/types";

function App() {
  const [characterData, setCharacterData] = useState<ExplorerData>({
    name: "",
    age: 0,
    job: "",
    characterStatusData: {
      str: "",
      dex: "",
      con: "",
      pow: "",
      int: "",
      app: "",
      edu: "",
      siz: "",
    },
    skills: [],
  });

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <CharacterForm onChange={setCharacterData} data={characterData} />
      <CanvasPreview explorerData={characterData} />
    </div>
  );
}

export default App;
