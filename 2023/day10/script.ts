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

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

const transformData = (text: string) => {
  return text.trim().split('\n').map((t) => t.split(''));
}
const posList = [ 'T', 'B', 'L', 'R' ];
const VectorData = {
  'T': {
    '|': 'T',
    '7': 'L',
    'F': 'R',
  },
  'B': {
    '|': 'B',
    'J': 'L',
    'L': 'R',
  },
  'R': {
    '-': 'R',
    '7': 'B',
    'J': 'T',
  },
  'L': {
    '-': '-',
    'F': 'B',
    'L': 'T',
  }
}
const VectorMapping = {
  '|': ['T', 'B'],
  '-': ['L', 'R'],
  'L': ['T', 'R'],
  'J': ['T', 'L'],
  'F': ['B', 'R'],
  '7': ['B', 'L'],
};
const PositionMapping = {
  'T': { x: 0, y: -1 },
  'B': { x: 0, y: 1 },
  'L': { x: -1, y: 0 },
  'R': { x: 1, y: 0 },
}

const pos2ki = (x, y) => x * 10000000 + y;


const find = (x, y, matrix, checkedData, step = 3) => {
  const char = matrix[y]?.[x];
  if (!char) {
    return 0;
  } else if (char === 'S' && step < 0) {
    return 1;
  } else if (checkedData[pos2ki(x, y)]) {
    return 0;
  } 
  checkedData[pos2ki(x, y)] = true;
  step --;
  
  if (!VectorMapping[char]) {
    return 0
  }
  
  return VectorMapping[char]
    .reduce((total, pos) => {
      const vector = PositionMapping[pos];
      const nextChar = find(x + vector.x, y + vector.y, matrix, checkedData, step);
      return total + (nextChar ? nextChar + 1 : 0);
    }, 0)
}

const find2 = (x, y, matrix, checkedData, step = 3) => {

  let char = matrix[y]?.[x];
  let nextCheckList = [];

  while (true) {
    const char = matrix[y]?.[x];
    
    if (!char) {
      return 0;
    } else if (char === 'S' && step < 0) {
      return 1;
    } else if (checkedData[pos2ki(x, y)]) {
      return 0;
    } 
    checkedData[pos2ki(x, y)] = true;
    step --;
    
    if (!VectorMapping[char]) {
      return 0
    }
    VectorMapping[char].forEach((pos) => {
      const vector = PositionMapping[pos];
      nextCheckList.push({x: x + vector.x, y: y + vector.y, step})
    }) 
  }
}

const countPathLength = (text: string): number => {
  const checkedData = {};
  const matrix = transformData(text);
  
  const sPos = matrix.reduce((pos, row, y) => {
    const x = row.indexOf('S');
    if (x !== -1) {
      return { x, y }
    }
    return pos;
  }, { x: -1, y: -1 });

  checkedData[pos2ki(sPos.x, sPos.y)] = true;
  
  const nextPosKi = posList.find((pos) => {
    const vector = PositionMapping[pos];
    VectorData[vector]
    return VectorData[pos][matrix[sPos.y + vector.y]?.[sPos.x + vector.x]]
  });
  let nextCheckList = [
    {
      x: sPos.x + PositionMapping[nextPosKi].x,
      y: sPos.y + PositionMapping[nextPosKi].y,
      step: 1
    }
  ];
  while (nextCheckList.length) {
    const checkData = nextCheckList.shift();
    const x = checkData.x;
    const y = checkData.y;
    const char = matrix[y]?.[x];
    let step = checkData.step;
    if (!char) {
      continue;
    } else if (char === 'S' && step > 3) {
      return step / 2;
    } else if (checkedData[pos2ki(x, y)]) {
      continue;
    } 
    step ++;
    checkedData[pos2ki(x, y)] = true;
    
    if (!VectorMapping[char]) {
      continue;
    }
    VectorMapping[char].forEach((pos) => {
      const vector = PositionMapping[pos];
      nextCheckList.push({x: x + vector.x, y: y + vector.y, step})
    }) 
  }
  return 0;
}
const a = 
`..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

const b = 
`
._...
|S-7.
||-|.
|L-J.
L-J..`
console.log(countPathLength(a));
console.log(countPathLength(data));