import { useEffect, useMemo, useRef, useState } from "hono/jsx";

interface IconCloudProps {
  images: string[];
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Rotation {
  x: number;
  y: number;
}

interface TargetRotation extends Rotation {
  startX: number;
  startY: number;
  startTime: number;
  duration: number;
}

interface AnimationState {
  rotation: Rotation;
  pointer: { x: number; y: number };
  drag: { x: number; y: number } | null;
  target: TargetRotation | null;
  loadedImages: (HTMLImageElement | null)[];
  sprites: (HTMLCanvasElement | null)[];
  spritePx: number;
}

// 大きさはすべて正方形の一辺に対する比率で決める。
// px の固定値を混ぜると、表示サイズによって球とアイコンのバランスが変わってしまう。
const SPHERE_RADIUS_RATIO = 0.35;
const ICON_SIZE_RATIO = 0.16;
const ICON_PADDING_RATIO = 0.1;

// ポインタは中心からのずれを一辺に対する比率で持つ。操作前はこの値でゆっくり回す。
const IDLE_POINTER = { x: 0.25, y: 0.25 };
const MAX_POINTER_DISTANCE = Math.SQRT1_2;
const BASE_SPEED = 0.003;
const POINTER_SPEED = 0.01;
const DRAG_SPEED = 0.002;

// depth は -1（最奥）から 1（最前）
function depthScale(depth: number): number {
  return 0.8 + 0.35 * depth;
}

function depthOpacity(depth: number): number {
  return Math.max(0.2, Math.min(1, 0.75 + depth));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// 単位球面上に均等に並べる（フィボナッチ球）
function fibonacciSphere(count: number): Vec3[] {
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));

  return Array.from({ length: count }, (_, i) => {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    return { x: Math.cos(phi) * r, y, z: Math.sin(phi) * r };
  });
}

function project(point: Vec3, rotation: Rotation) {
  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);

  const x = point.x * cosY - point.z * sinY;
  const depth = point.x * sinY + point.z * cosY;
  const y = point.y * cosX + depth * sinX;

  return { x, y, depth };
}

function createSprite(img: HTMLImageElement, px: number): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = px;
  sprite.height = px;
  const padding = px * ICON_PADDING_RATIO;
  sprite.getContext("2d")?.drawImage(img, padding, padding, px - padding * 2, px - padding * 2);
  return sprite;
}

/**
 * 親要素の幅いっぱいの正方形に描画する。大きさは親要素側で決める。
 */
export default function IconCloud({ images }: IconCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState({ size: 0, dpr: 1 });
  const { size, dpr } = view;

  // 毎フレーム書き換える値。再描画を起こさないよう、同じオブジェクトを直接書き換える。
  const [state] = useState<AnimationState>(() => ({
    rotation: { x: 0, y: 0 },
    pointer: IDLE_POINTER,
    drag: null,
    target: null,
    loadedImages: [],
    sprites: [],
    spritePx: 0,
  }));

  const points = useMemo(() => fibonacciSphere(images.length), [images.length]);

  const radius = size * SPHERE_RADIUS_RATIO;
  const iconSize = size * ICON_SIZE_RATIO;
  // 最前面での表示サイズに合わせてラスタライズする
  const spritePx = Math.ceil(iconSize * depthScale(1) * dpr);
  state.spritePx = spritePx;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const nextSize = container.clientWidth;
      // 非表示のあいだは前回の値を保つ
      if (nextSize === 0) return;
      const nextDpr = window.devicePixelRatio || 1;
      setView((prev) =>
        prev.size === nextSize && prev.dpr === nextDpr ? prev : { size: nextSize, dpr: nextDpr },
      );
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    state.loadedImages = images.map(() => null);
    state.sprites = images.map(() => null);

    images.forEach((imageUrl, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.addEventListener(
        "load",
        () => {
          if (cancelled) return;
          state.loadedImages[index] = img;
          if (state.spritePx > 0) {
            state.sprites[index] = createSprite(img, state.spritePx);
          }
        },
        { once: true },
      );
      img.src = imageUrl;
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  // 表示サイズが変わったら読み込み済みのアイコンを作り直す
  useEffect(() => {
    if (spritePx === 0) return;
    state.loadedImages.forEach((img, index) => {
      if (img) state.sprites[index] = createSprite(img, spritePx);
    });
  }, [spritePx]);

  const toLocal = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, size: rect.width };
  };

  const handleMouseDown = (e: MouseEvent) => {
    const local = toLocal(e);
    if (!local) return;

    const rotation = state.rotation;
    const center = local.size / 2;
    let hit: { point: Vec3; depth: number } | null = null;

    for (const point of points) {
      const projected = project(point, rotation);
      const hitRadius = (local.size * ICON_SIZE_RATIO * depthScale(projected.depth)) / 2;
      const dx = local.x - (center + projected.x * local.size * SPHERE_RADIUS_RATIO);
      const dy = local.y - (center + projected.y * local.size * SPHERE_RADIUS_RATIO);
      const isInside = dx * dx + dy * dy < hitRadius * hitRadius;
      if (isInside && (!hit || projected.depth > hit.depth)) {
        hit = { point, depth: projected.depth };
      }
    }

    if (hit) {
      const { point } = hit;
      const targetX = -Math.atan2(point.y, Math.hypot(point.x, point.z));
      const targetY = Math.atan2(point.x, point.z);
      const distance = Math.hypot(targetX - rotation.x, targetY - rotation.y);

      state.target = {
        x: targetX,
        y: targetY,
        startX: rotation.x,
        startY: rotation.y,
        startTime: performance.now(),
        duration: Math.min(2000, Math.max(800, distance * 1000)),
      };
    }

    state.drag = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    const local = toLocal(e);
    if (local) {
      state.pointer = {
        x: local.x / local.size - 0.5,
        y: local.y / local.size - 0.5,
      };
    }

    const drag = state.drag;
    if (drag) {
      const rotation = state.rotation;
      state.rotation = {
        x: rotation.x + (e.clientY - drag.y) * DRAG_SPEED,
        y: rotation.y + (e.clientX - drag.x) * DRAG_SPEED,
      };
      state.drag = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    state.drag = null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || size === 0) return;

    let frame = 0;

    const animate = () => {
      // 以降は CSS px の座標系で描く
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const target = state.target;
      if (target) {
        const progress = Math.min(1, (performance.now() - target.startTime) / target.duration);
        const eased = easeOutCubic(progress);
        state.rotation = {
          x: target.startX + (target.x - target.startX) * eased,
          y: target.startY + (target.y - target.startY) * eased,
        };
        if (progress >= 1) state.target = null;
      } else if (!state.drag) {
        const pointer = state.pointer;
        const distance = Math.hypot(pointer.x, pointer.y);
        const speed = BASE_SPEED + (distance / MAX_POINTER_DISTANCE) * POINTER_SPEED;
        const rotation = state.rotation;
        state.rotation = {
          x: rotation.x + pointer.y * speed,
          y: rotation.y + pointer.x * speed,
        };
      }

      const rotation = state.rotation;
      const center = size / 2;
      const projected = points
        .map((point, id) => ({ id, ...project(point, rotation) }))
        .toSorted((a, b) => a.depth - b.depth);

      for (const icon of projected) {
        const drawSize = iconSize * depthScale(icon.depth);
        const cx = center + icon.x * radius;
        const cy = center + icon.y * radius;
        const sprite = state.sprites[icon.id];

        ctx.globalAlpha = depthOpacity(icon.depth);
        if (sprite) {
          ctx.drawImage(sprite, cx - drawSize / 2, cy - drawSize / 2, drawSize, drawSize);
        } else {
          // 読み込み中は円で代用する
          ctx.beginPath();
          ctx.arc(cx, cy, drawSize * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = "#3f3f46";
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, [points, size, dpr, radius, iconSize]);

  return (
    <div ref={containerRef} class="w-full aspect-square">
      <canvas
        ref={canvasRef}
        width={Math.round(size * dpr)}
        height={Math.round(size * dpr)}
        onMouseDown={handleMouseDown as unknown as () => void}
        onMouseMove={handleMouseMove as unknown as () => void}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        class="cursor-grab active:cursor-grabbing block w-full h-full"
        aria-label="Interactive 3D Icon Cloud"
        role="img"
      />
    </div>
  );
}
