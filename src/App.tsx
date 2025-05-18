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

  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null
  );

  return (
    <div className="main" style={{ gap: "2rem", padding: "2rem" }}>
      <CharacterForm
        onChange={setCharacterData}
        setImage={setUploadedImage}
        data={characterData}
      />
      <CanvasPreview
        explorerData={characterData}
        uploadedImage={uploadedImage}
      />
    </div>
  );
}

export default App;
