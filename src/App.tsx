import { useState } from "react";
import CanvasPreview from "./components/CanvasPreview";
import CharacterForm from "./components/CharacterForm";
import type { ExplorerData } from "./components/types/types";
import ImageUploader from "./components/ImageUploader";

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
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <CharacterForm onChange={setCharacterData} data={characterData} />
      <ImageUploader onImageUpload={setUploadedImage} />
      <CanvasPreview
        explorerData={characterData}
        uploadedImage={uploadedImage}
      />
    </div>
  );
}

export default App;
