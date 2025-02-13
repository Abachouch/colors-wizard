import { useEffect, useState } from "react";
import { getColors, _variants } from "theme-colors";
import { isHex } from "is-color";

import chroma from "chroma-js";

export const ColorsLab = () => {
  const [hex, setHex] = useState("#3498db"); // Default color
  const [hsl, setHsl] = useState<number[]>([0, 0, 0]);
  const [tints, setTints] = useState<string[]>([]);
  const [shades, setShades] = useState<string[]>([]);
  const [themeClrs, setThemeClrs] = useState<{}>({});

  useEffect(() => {
    if (isHex(hex)) {
      if (hex.length === 4 || hex.length === 7) {
        setHsl(chroma(hex).hsl());
        const shades2 = getTheme(hex);
        const { tints: t, shades: s } = generateShadesTints(hex);
        setTints(t);
        setShades(s);
        setThemeClrs(shades2);
      }
    }
  }, [hex]);

  const getTheme = (color: string) => {
    const colors = getColors(color);
    console.log("colors", colors);
    return colors;
  };

  function generateShadesTints(color: string) {
    let base = chroma(color);
    let tints = Array.from({ length: 5 }, (_, i) => base.brighten(i + 1).hex());
    let shades = Array.from({ length: 5 }, (_, i) => base.darken(i + 1).hex());
    return { tints, shades };
  }

  function handleHslChange(type: number, value: number) {
    let newHsl = [...hsl];
    newHsl[type] = value;
    const newHex = chroma.hsl(newHsl[0], newHsl[1], newHsl[2]).hex();
    setHsl(newHsl);
    setHex(newHex);
  }

  return (
    <div>
      <header className="header">
        <div className="in">
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
          />
          <div className="selectedColor" style={{ backgroundColor: hex }}></div>
        </div>
        <div className="slider">
          {/* HSL Adjusters */}
          <div className="mb-4">
            <label className="block">Hue: {Math.round(hsl[0])}°</label>
            <input
              type="range"
              min="0"
              max="360"
              value={hsl[0]}
              onChange={(e) => handleHslChange(0, Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block">
              Saturation: {Math.round(hsl[1] * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hsl[1]}
              onChange={(e) => handleHslChange(1, Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block">
              Lightness: {Math.round(hsl[2] * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={hsl[2]}
              onChange={(e) => handleHslChange(2, Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </header>

      <h3>shades</h3>
      <div className="results-section">
        <div className="shades">
          {shades.map((shade, i) => (
            <div className="shade-container">
              {shade}
              <div
                key={i}
                className="shade"
                style={{ backgroundColor: shade }}
              ></div>
            </div>
          ))}
        </div>

        <h3>tints</h3>
        <div className="shades">
          {tints.map((shade, i) => (
            <div key={i} className="shade" style={{ backgroundColor: shade }}>
              {shade}
            </div>
          ))}
        </div>

        <h3>theme colors</h3>
        <div className="shades">
          {Object.entries(themeClrs).map(([shade, color], i) => (
            <div
              key={i}
              className="shade"
              style={{ backgroundColor: color as string }}
            >
              {shade} - {color as string}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
