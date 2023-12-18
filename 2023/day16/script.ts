const fs = require("fs");
const path = require("path");

// 定義 TypeScript 檔案的路徑
const tsFilePath = path.join(__dirname, "./data.txt");

// 使用 fs.readFile 讀取 TypeScript 檔案
const data = fs.readFileSync(tsFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading TypeScript file:", err);
    return;
  }
  return data;
});

enum LD {
  T = '↑',
  B = '↓',
  L = '←',
  R = '→',
}
const LD2Vector = {
  [LD.T]: { x: 0, y: -1 },
  [LD.B]: { x: 0, y: 1 },
  [LD.L]: { x: -1, y: 0 },
  [LD.R]: { x: 1, y: 0 },
}
const DirectionMapping = {
  [LD.T]: {
    '/': [LD.R],
    '\\': [LD.L],
    '-': [LD.L, LD.R],
    '|': [LD.T],
    '.': [LD.T]
  },
  [LD.B]: {
    '/': [LD.L],
    '\\': [LD.R],
    '-': [LD.L, LD.R],
    '|': [LD.B],
    '.': [LD.B]
  },
  [LD.L]: {
    '/': [LD.B],
    '\\': [LD.T],
    '-': [LD.L],
    '|': [LD.T, LD.B],
    '.': [LD.L]
  },
  [LD.R]: {
    '/': [LD.T],
    '\\': [LD.B],
    '-': [LD.R],
    '|': [LD.T, LD.B],
    '.': [LD.R]
  },
}

const transformMap = (text: string) => text.trim().split('\n').map((row) => row.split(''));

const dataToString = (direction: LD, pos: { x: number, y: number }) => `${direction},${pos.x},${pos.y}`;

const calcEnergized = (matrix: string[][], startPos: { x: number, y: number }, direction: LD) => {
  const width = matrix[0].length;
  const height = matrix.length;
  let checkedData = {};
  let lightData = {};
  let checkList = [{ x: startPos.x, y: startPos.y, direction }]
  while (checkList.length) {
    const pos = checkList.shift();
    const ki = dataToString(pos.direction, pos);
    const action = matrix[pos.y][pos.x];
    if (checkedData[ki] && action !== '.') {
      continue;
    }
    checkedData[ki] = true;
    lightData[`${pos.x},${pos.y}`] = true;
    
    DirectionMapping[pos.direction][action].forEach((innerAction) => {
      const vector = LD2Vector[innerAction];
      const newPos = {
        x: pos.x + vector.x,
        y: pos.y + vector.y,
        direction: innerAction
      }
      if (
        newPos.x >= 0 && 
        newPos.y >= 0 &&
        newPos.x < width &&
        newPos.y < height
      ) {
        checkList.push(newPos)
      }
    })
  };
  return Object.keys(lightData).length;
}
const countEnergizedPart1 = (text: string) => {
  const matrix = transformMap(text);
  return calcEnergized(matrix, {x: 0, y: 0}, LD.R);
};

const countEnergizedPart2 = (text: string) => {
  const matrix = transformMap(text);
  const width = matrix[0].length;
  const height = matrix.length;
  const startList = [];
  matrix.forEach((row, y) => {
    row.forEach((_, x) => {});
    startList.push({
      x: 0,
      y,
      direction: LD.R
    })
    startList.push({
      x: width - 1,
      y,
      direction: LD.L
    })
  });
  matrix[0].forEach((row, x) => {
    startList.push({
      x,
      y: 0,
      direction: LD.B
    })
    startList.push({
      x,
      y: height - 1,
      direction: LD.T
    })
  })
  const allDirectionList = startList.map((d) => calcEnergized(matrix, {x: d.x, y: d.y}, d.direction));

  return Math.max(...allDirectionList)
}

console.log('part1:', countEnergizedPart1(data));
console.log('part2:', countEnergizedPart2(data));
// part1: 6883
// part2: 7228
