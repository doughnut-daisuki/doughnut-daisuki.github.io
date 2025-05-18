import React, { useEffect, useRef, useState } from "react";
import type { ExplorerData } from "./types/types";
import {
  calculateDamageBonus,
  getStringByteCount,
} from "../util/skillCalculation";

export interface CharacterData {
  name: string;
  age: string;
  job: string;
  skills: { name: string; value: string; category?: string | null }[];
}

interface CanvasPreviewProps {
  explorerData: ExplorerData;
  uploadedImage: HTMLImageElement | null;
}

type ImageTransform = {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
  scale: number;
};

const TEMPLATE_IMAGE_SRC = "/template.png"; // 適宜差し替え

const HORIZONTAL_REFERENCE = 525;
const VERTICAL_REFERENCE = 204;
const HORIZONTAL_ADDITION = 145;
const VERTICAL_ADDITION = 62;

const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  explorerData,
  uploadedImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    aspectRatio: 1,
    scale: 1,
    height: 200,
    width: 200,
    x: 50,
    y: 50,
  });

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);

  useEffect(() => {
    if (uploadedImage) {
      const ratio = uploadedImage.naturalHeight / uploadedImage.naturalWidth;
      const defaultWidth = 500;

      setImageTransform({
        x: 100,
        y: 100,
        width: defaultWidth,
        height: defaultWidth * ratio,
        aspectRatio: ratio,
        scale:1,
      });
    }
  }, [uploadedImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const template = new Image();
    template.src = TEMPLATE_IMAGE_SRC;
    const statusKeys = [
      "str",
      "con",
      "pow",
      "dex",
      "app",
      "siz",
      "int",
      "edu",
      "san",
      "luck",
      "knowledge",
      "idea",
      "hp",
      "mp",
      "db",
    ];
    template.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

      // ユーザーアップロード画像の描画（例：x=400, y=40, 幅=100, 高さ=100）
      // アップロード画像の描画
      if (uploadedImage) {
        ctx.drawImage(
          uploadedImage,
          imageTransform.x,
          imageTransform.y,
          imageTransform.width,
          imageTransform.height
        );
      }

      ctx.font = "42px Helvetica, Arial";
      ctx.fillStyle = "black";

      // 名前（文字数とバイト数でフォントサイズを計算）
      const strLengthRatio =
        explorerData.name.length / getStringByteCount(explorerData.name);
      console.log(strLengthRatio * explorerData.name.length);
      const fontSize =
        Math.floor(160 / getStringByteCount(explorerData.name)) +
        explorerData.name.length;
      const fontPx = fontSize > 42 ? 42 : fontSize;
      ctx.font = fontPx.toString() + "px Helvetica, Arial";
      ctx.fillText(`${explorerData.name}`, 460 + fontPx, 100);

      // 各ステータスの計算+描画
      statusKeys.forEach((key, index) => {
        const row = Math.floor(index / 5); // 1行目: 0〜4, 2行目: 5〜
        const col = index % 5;

        const x = HORIZONTAL_REFERENCE + HORIZONTAL_ADDITION * col;
        const y = VERTICAL_REFERENCE + VERTICAL_ADDITION * row;

        const pow = Number(explorerData.characterStatusData["pow"]);
        const edu = Number(explorerData.characterStatusData["edu"]);
        const int = Number(explorerData.characterStatusData["int"]);
        const str = Number(explorerData.characterStatusData["str"]);
        const siz = Number(explorerData.characterStatusData["siz"]);
        const con = Number(explorerData.characterStatusData["con"]);
        ctx.font = "42px Helvetica, Arial";

        if (key === "san" || key === "luck") {
          ctx.fillText(`${pow * 5}`, x, y);
        } else if (key === "knowledge") {
          ctx.fillText(`${edu * 5}`, x, y);
        } else if (key === "idea") {
          ctx.fillText(`${int * 5}`, x, y);
        } else if (key === "hp") {
          ctx.fillText(`${Math.round((siz + con) / 2)}`, x, y);
        } else if (key === "mp") {
          ctx.fillText(`${pow}`, x, y);
        } else if (key === "db") {
          const db = calculateDamageBonus(str, siz);
          // DBは文字数が多いのでフォントを小さくする
          ctx.font = "36px Helvetica, Arial";
          ctx.fillText(`${db}`, x - 10, y);
        } else {
          ctx.font = "42px Helvetica, Arial";
          ctx.fillText(
            `${
              explorerData.characterStatusData[
                key as keyof typeof explorerData.characterStatusData
              ]
            }`,
            x,
            y
          );
        }
      });

      // 技能を動的に描画
      const startX = 470;
      const startY = 465;
      const lineHeight = 65;
      const lineWidth = 240;

      explorerData.skills.forEach((skill, index) => {
        const xCount = index < 3 ? index : index % 3;
        const x = startX + xCount * lineWidth;
        const y = startY + Math.floor(index / 3) * lineHeight;
        const label = skill.category
          ? `${skill.category}${skill.name}`
          : skill.name;
        ctx.font = "24px Helvetica, Arial";
        ctx.fillText(`${label} ${skill.value}`, x, y);
      });
    };
  }, [explorerData, imageTransform, uploadedImage]);

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

  // マウス操作
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const { x, y, width } = imageTransform;
    if (
      mouseX >= x &&
      mouseX <= x + width &&
      mouseY >= y &&
      mouseY <= y + width
    ) {
      setDragging(true);
      setOffset({ x: mouseX - x, y: mouseY - y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setImageTransform((prev) => ({
      ...prev,
      x: mouseX - offset.x,
      y: mouseY - offset.y,
    }));
  };

  const handleMouseUp = () => setDragging(false);

 // ホイールズーム（PC用）
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.05 : 0.95;
    setImageTransform((prev) => ({
      ...prev,
      scale: Math.max(0.1, prev.scale * delta),
    }));
  };

  // タッチ（ドラッグ & ピンチズーム）
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && uploadedImage) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const { x: imgX, y: imgY, scale } = imageTransform;
      const w = uploadedImage.width * scale;
      const h = uploadedImage.height * scale;
      if (x >= imgX && x <= imgX + w && y >= imgY && y <= imgY + h) {
        setDragging(true);
        setOffset({ x: x - imgX, y: y - imgY });
      }
    } else if (e.touches.length === 2) {
      const [t1, t2] = Array.from(e.touches);
      const dist = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
      );
      lastTouchDistance.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && dragging) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setImageTransform((prev) => ({
        ...prev,
        x: x - offset.x,
        y: y - offset.y,
      }));
    } else if (e.touches.length === 2) {
      const [t1, t2] = Array.from(e.touches);
      const newDist = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
      );
      if (lastTouchDistance.current) {
        const delta = newDist / lastTouchDistance.current;
        setImageTransform((prev) => ({
          ...prev,
          scale: Math.max(0.1, prev.scale * delta),
        }));
      }
      lastTouchDistance.current = newDist;
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    lastTouchDistance.current = null;
  };

  return (
    <div>
      <h2>画像プレビュー</h2>
      <canvas
        ref={canvasRef}
        width={1200}
        height={1053}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{
          border: "1px solid #ccc",
          maxWidth: "100%",
          height: "auto",
          touchAction: "none",
        }}
      />

      {uploadedImage && (
        <div className="mt-2">
          <label>
            画像サイズ:
            <input
              type="range"
              min={200}
              max={500}
              value={imageTransform.width}
              onChange={(e) => {
                const newWidth = Number(e.target.value);
                setImageTransform((prev) => ({
                  ...prev,
                  width: newWidth,
                  height: newWidth * prev.aspectRatio,
                }));
              }}
            />
          </label>
          ※微調整しかできません
        </div>
      )}

      <button onClick={handleSave} style={{ marginTop: "1rem" }}>
        画像として保存
      </button>
      <p style={{ fontSize: "0.9rem", color: "#555", marginTop: "0.5rem" }}>
        ※ボタンが動作しない場合は画像を長押ししてみてください
      </p>
    </div>
  );
};

export default CanvasPreview;
