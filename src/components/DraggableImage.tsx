import React, { useEffect, useState } from "react";

export type ImageTransform = {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio: number;
};

type Props = {
  uploadedImage: HTMLImageElement;
  initialPosition?: { x: number; y: number };
  onTransformChange?: (transform: ImageTransform) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export const DraggableImage: React.FC<Props> = ({
  uploadedImage,
  initialPosition = { x: 100, y: 100 },
  onTransformChange,
  canvasRef,
}) => {
  const [transform, setTransform] = useState<ImageTransform>({
    x: initialPosition.x,
    y: initialPosition.y,
    width: 100,
    height: 100,
    aspectRatio: uploadedImage.naturalHeight / uploadedImage.naturalWidth,
  });

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const newRatio = uploadedImage.naturalHeight / uploadedImage.naturalWidth;
    const width = 100;
    setTransform({
      x: initialPosition.x,
      y: initialPosition.y,
      width,
      height: width * newRatio,
      aspectRatio: newRatio,
    });
  }, [initialPosition, uploadedImage]);

  useEffect(() => {
    onTransformChange?.(transform);
  }, [transform, onTransformChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const { x, y, width, height } = transform;
    if (
      mouseX >= x &&
      mouseX <= x + width &&
      mouseY >= y &&
      mouseY <= y + height
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

    setTransform((prev) => ({
      ...prev,
      x: mouseX - offset.x,
      y: mouseY - offset.y,
    }));
  };

  const handleMouseUp = () => setDragging(false);

  const handleResize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setTransform((prev) => ({
      ...prev,
      width: newWidth,
      height: newWidth * prev.aspectRatio,
    }));
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={842}
        height={595}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ border: "1px solid #ccc", touchAction: "none" }}
      />
      <div className="mt-2">
        <label>
          画像サイズ:
          <input
            type="range"
            min={50}
            max={300}
            value={transform.width}
            onChange={handleResize}
          />
        </label>
      </div>
    </>
  );
};
