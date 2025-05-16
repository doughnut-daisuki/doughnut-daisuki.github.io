import React, { useEffect, useRef } from "react";
import type { ExplorerData } from "./types/types";

type Props = {
  explorerData: ExplorerData;
};

const HORIZONTAL_REFERENCE = 520;
const VERTICAL_REFERENCE = 204;
const HORIZONTAL_ADDITION = 145;
const VERTICAL_ADDITION = 62;

const CanvasPreview: React.FC<Props> = ({ explorerData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateSrc = "/template.png";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = templateSrc;

    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      ctx.font = "42px Helvetica, Arial";
      ctx.fillStyle = "black";

      ctx.fillText(`名前: ${explorerData.name}`, 30, 80);
      ctx.fillText(
        `${explorerData.characterStatusData.str}`,
        HORIZONTAL_REFERENCE,
        VERTICAL_REFERENCE
      );
      ctx.fillText(
        `${explorerData.characterStatusData.con}`,
        HORIZONTAL_REFERENCE + HORIZONTAL_ADDITION,
        VERTICAL_REFERENCE
      );
      ctx.fillText(
        `${explorerData.characterStatusData.pow}`,
        HORIZONTAL_REFERENCE + HORIZONTAL_ADDITION * 2,
        VERTICAL_REFERENCE
      );
      ctx.fillText(
        `${explorerData.characterStatusData.dex}`,
        HORIZONTAL_REFERENCE + HORIZONTAL_ADDITION * 3,
        VERTICAL_REFERENCE
      );
      ctx.fillText(
        `${explorerData.characterStatusData.app}`,
        HORIZONTAL_REFERENCE + HORIZONTAL_ADDITION * 4,
        VERTICAL_REFERENCE
      );

      ctx.fillText(
        `${explorerData.characterStatusData.siz}`,
        HORIZONTAL_REFERENCE,
        VERTICAL_REFERENCE + VERTICAL_ADDITION
      );
      ctx.fillText(
        `${explorerData.characterStatusData.int}`,
        HORIZONTAL_REFERENCE + HORIZONTAL_ADDITION,
        VERTICAL_REFERENCE + VERTICAL_ADDITION
      );
      ctx.fillText(
        `${explorerData.characterStatusData.edu}`,
        HORIZONTAL_REFERENCE + HORIZONTAL_ADDITION * 2,
        VERTICAL_REFERENCE + VERTICAL_ADDITION
      );

      // 技能を動的に描画
      const startX = 400;
      const startY = 100;
      const lineHeight = 30;

      explorerData.skills.forEach((skill, index) => {
        const y = startY + index * lineHeight;
        const label = skill.category
          ? `${skill.category}：${skill.name}`
          : skill.name;
        ctx.fillText(`${label}: ${skill.value}`, startX, y);
      });
    };
  }, [explorerData]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "character_sheet.png";
      link.click();

      URL.revokeObjectURL(link.href);
    }, "image/png");
  };

  return (
    <div>
      <h2>画像プレビュー</h2>
      <canvas
        ref={canvasRef}
        width={1200}
        height={1053}
        style={{ border: "1px solid #ccc", maxWidth: "100%", height: "auto" }}
      />
      <button onClick={handleSave} style={{ marginTop: "1rem" }}>
        画像として保存
      </button>
      <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
        ※ スマホの場合は画像を長押しして保存してください
      </p>
    </div>
  );
};

export default CanvasPreview;
