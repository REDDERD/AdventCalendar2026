import { useEffect, useState, type CSSProperties } from 'react';
import { assetUrl, getDef, loadImage, placeholderColor, sourceFileOf } from '../assets/AssetRegistry';
import { isCrop, type FileAsset } from '../assets/manifest';

interface Props {
  id: string;
  w: number;
  h: number;
  /** Frame index for sprite sheets (frameW/frameH in the manifest). */
  frame?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders an image asset by logical ID [GFX-5]: plain files, sprite-sheet
 * frames and crops (phase-1 portraits). Missing files become a coloured
 * placeholder with the ID [GFX-6].
 */
export function AssetImage({ id, w, h, frame = 0, className, style }: Props) {
  const [img, setImg] = useState<HTMLImageElement | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    setImg(undefined);
    loadImage(id).then((result) => alive && setImg(result));
    return () => {
      alive = false;
    };
  }, [id]);

  const base: CSSProperties = { width: w, height: h, ...style };
  if (img === undefined) return <div className={className} style={base} />;
  if (img === null) return <Placeholder id={id} className={className} style={base} />;

  const def = getDef(id)!;
  const file = assetUrl(sourceFileOf(id)!);
  let x = 0;
  let y = 0;
  let scale = 1;
  let srcDef: FileAsset;
  if (isCrop(def)) {
    [x, y] = def.crop;
    scale = def.scale ?? 1;
    srcDef = getDef(def.from) as FileAsset;
  } else {
    srcDef = def;
  }
  if (srcDef.frameW && srcDef.frameH) {
    const cols = Math.max(1, Math.floor(img.naturalWidth / srcDef.frameW));
    x += (frame % cols) * srcDef.frameW;
    y += Math.floor(frame / cols) * srcDef.frameH;
    // Sprite frames are scaled to the requested size (64 px frames shown at 128 px).
    if (!isCrop(def)) scale = w / srcDef.frameW;
  } else if (!isCrop(def)) {
    // Single images are scaled to the requested size (e.g. 32 px pets shown at 64 px).
    scale = w / img.naturalWidth;
  }
  return (
    <div
      className={`pixelated ${className ?? ''}`}
      style={{
        ...base,
        backgroundImage: `url(${file})`,
        backgroundPosition: `${-x * scale}px ${-y * scale}px`,
        backgroundSize: `${img.naturalWidth * scale}px ${img.naturalHeight * scale}px`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}

export function Placeholder({ id, className, style }: { id: string; className?: string; style?: CSSProperties }) {
  return (
    <div className={`placeholder ${className ?? ''}`} style={{ background: placeholderColor(id), ...style }}>
      <span>{id}</span>
    </div>
  );
}
