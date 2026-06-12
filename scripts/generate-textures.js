// Генерирует 16x16 пиксельные текстуры в стиле Minecraft в assets/.
// Запуск: node scripts/generate-textures.js
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const SIZE = 16;
const OUT_DIR = path.join(__dirname, "..", "assets");

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(pixels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);
  ihdr.writeUInt32BE(SIZE, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolor

  const raw = Buffer.alloc(SIZE * (1 + SIZE * 3));
  for (let y = 0; y < SIZE; y += 1) {
    const rowStart = y * (1 + SIZE * 3);
    raw[rowStart] = 0; // no filter
    for (let x = 0; x < SIZE; x += 1) {
      const [r, g, b] = pixels[y][x];
      const i = rowStart + 1 + x * 3;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
    }
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function mulberry32(seed) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hex(color) {
  return [
    parseInt(color.slice(1, 3), 16),
    parseInt(color.slice(3, 5), 16),
    parseInt(color.slice(5, 7), 16),
  ];
}

function weightedPalette(entries) {
  const flat = [];
  for (const [color, weight] of entries) {
    for (let i = 0; i < weight; i += 1) {
      flat.push(hex(color));
    }
  }
  return flat;
}

function noiseTexture(seed, entries) {
  const rand = mulberry32(seed);
  const palette = weightedPalette(entries);
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => palette[Math.floor(rand() * palette.length)]),
  );
}

const DIRT_COLORS = [
  ["#866043", 4],
  ["#79553a", 3],
  ["#936f4c", 2],
  ["#6b4a31", 2],
  ["#9c7753", 1],
  ["#5c3f2a", 1],
];

const GRASS_COLORS = [
  ["#7cbd4b", 4],
  ["#6aad3d", 3],
  ["#8ecc5a", 2],
  ["#5d9c38", 2],
  ["#4f8a2f", 1],
];

function grassSideTexture(seed) {
  const rand = mulberry32(seed);
  const grass = weightedPalette(GRASS_COLORS);
  const dirt = weightedPalette(DIRT_COLORS);
  return Array.from({ length: SIZE }, (_, y) =>
    Array.from({ length: SIZE }, () => {
      // верхние 3 ряда — трава, 4-й — рваная граница травы и земли
      const isGrass = y < 3 || (y === 3 && rand() < 0.45) || (y === 4 && rand() < 0.12);
      const palette = isGrass ? grass : dirt;
      return palette[Math.floor(rand() * palette.length)];
    }),
  );
}

function tntTexture(seed) {
  const rand = mulberry32(seed);
  const reds = weightedPalette([
    ["#cf3a1f", 4],
    ["#b32d16", 3],
    ["#e8543a", 2],
    ["#962413", 1],
  ]);
  const band = weightedPalette([
    ["#ece6d4", 4],
    ["#d9d3c1", 2],
    ["#f6f1e1", 1],
  ]);
  const ink = hex("#1f1f1f");
  // шрифт 3x5 для надписи TNT
  const T = [[1, 1, 1], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]];
  const N = [[1, 1, 0], [1, 0, 1], [1, 0, 1], [1, 0, 1], [1, 0, 1]];
  const letters = [[T, 2], [N, 7], [T, 12]];

  return Array.from({ length: SIZE }, (_, y) =>
    Array.from({ length: SIZE }, (_, x) => {
      if (y >= 5 && y <= 10) {
        if (y >= 6) {
          for (const [glyph, offsetX] of letters) {
            const gx = x - offsetX;
            const gy = y - 6;
            if (gx >= 0 && gx < 3 && glyph[gy][gx]) {
              return ink;
            }
          }
        }
        return band[Math.floor(rand() * band.length)];
      }
      return reds[Math.floor(rand() * reds.length)];
    }),
  );
}

function creeperTexture(seed) {
  const rand = mulberry32(seed);
  const greens = weightedPalette([
    ["#5ec24a", 4],
    ["#4aa83a", 3],
    ["#6fd05a", 2],
    ["#3f8f31", 2],
    ["#7ddd66", 1],
  ]);
  const dark = hex("#142b10");
  const FACE = [
    "........",
    "........",
    ".XX..XX.",
    ".XX..XX.",
    "...XX...",
    "..XXXX..",
    "..XXXX..",
    "..X..X..",
  ];

  return Array.from({ length: SIZE }, (_, y) =>
    Array.from({ length: SIZE }, (_, x) => {
      if (FACE[Math.floor(y / 2)][Math.floor(x / 2)] === "X") {
        return dark;
      }
      return greens[Math.floor(rand() * greens.length)];
    }),
  );
}

const textures = {
  "mc-tnt.png": tntTexture(48151623),
  "mc-creeper.png": creeperTexture(31337),
  "mc-dirt.png": noiseTexture(20260612, DIRT_COLORS),
  "mc-grass-side.png": grassSideTexture(777),
  "mc-stone.png": noiseTexture(424242, [
    ["#7d7d7d", 4],
    ["#828282", 3],
    ["#747474", 3],
    ["#696969", 2],
    ["#8c8c8c", 1],
  ]),
  "mc-bedrock.png": noiseTexture(1337, [
    ["#575757", 2],
    ["#393939", 3],
    ["#6b6b6b", 2],
    ["#252525", 2],
    ["#161616", 1],
  ]),
};

for (const [name, pixels] of Object.entries(textures)) {
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, encodePng(pixels));
  console.log(`written ${file}`);
}
