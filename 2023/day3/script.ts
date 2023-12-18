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


interface vector {
  x: number;
  y: number;
}

const nextVectorList = [{ x: 1, y: 0 }];
const nextOtherVectorList = [
  { x: 1, y: 1 },
  { x: 1, y: -1 },
];
const otherVectorList = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
];
const isNumber = (num): boolean => typeof num === 'number' && !isNaN(num);

const vectorToKi = (vector: vector) => vector ? `${vector.x},${vector.y}` : null;

const getNumber = (
  x: number,
  y: number,
  list: string[],
  charCount = "",
  skipCheck = false,
  starPos: vector = null,
): {
  numberText: string;
  starPos: vector;
} => {
  const char = +(list?.[y]?.[x]);
  const nextChar = +(list?.[y]?.[x + 1]);
  const isNextNumber = isNumber(nextChar);
  
  if (!isNumber(char)) {
    return { numberText: skipCheck ? charCount : '', starPos };
  }
  
  if (!skipCheck) {
    if (!charCount) {
      const checkData = checkCharVector(x, y, list, otherVectorList);
      skipCheck = checkData.isMatch;
      starPos = starPos || checkData.starPos;
    }
    
    if (isNextNumber) {
      const checkData = checkCharVector(x, y, list, nextOtherVectorList);
      skipCheck = skipCheck || checkData.isMatch;
      starPos = starPos || checkData.starPos;
    } else {
      const checkData1 = checkCharVector(x, y, list, nextOtherVectorList);
      const checkData2 = checkCharVector(x, y, list, nextVectorList);

      skipCheck = skipCheck || checkData1.isMatch || checkData2.isMatch;
      starPos = starPos || checkData1.starPos || checkData2.starPos;
    }
  }
  
  const newChar = charCount + char;
  if (isNextNumber) {
    return getNumber(x + 1, y, list, newChar, skipCheck, starPos);
  }
  return {numberText: skipCheck ? newChar : '', starPos};
};

const checkCharVector = (
  x: number,
  y: number,
  list: string[],
  vectorListForcheckList: vector[],
): {
  isMatch: boolean;
  starPos: vector;
} => {
  let isMatch = false;
  let starPos = null
  vectorListForcheckList.some((vector) => {
    const t = list?.[y + vector.y]?.[x + vector.x];
    isMatch = isMatch || t !== "." && t !== (void 0) && !isNumber(+t);
    if (t === '*') {
      starPos = {
        x: x + vector.x,
        y: y + vector.y
      };
    }
  });
  return { isMatch, starPos }
};

const calcEnginePart1 = (data: string) => {
  const rowList = (data || "").split("\n");
  return rowList.reduce((total, row, y) => {
    let innerTotal = 0;
    for (let x = 0, max = row.length; x < max; x++) {
      const numberText = getNumber(x, y, rowList).numberText || 0;
      if (!numberText) {
        continue;
      } else {
        x += numberText.length;
      }
    
      innerTotal += +numberText;
    }
    return total + innerTotal;
  }, 0);
};

const calcEnginePart2 = (data: string) => {
  const rowList = (data || "").split("\n");
  const starData: { [pos: string]: number[] } = {};
  rowList.forEach((row, y) => {
    let innerTotal = 0;
    for (let x = 0, max = row.length; x < max; x++) {
      const numberData = getNumber(x, y, rowList);
      if (!numberData.numberText) {
        continue;
      } 
      let numberText = numberData.numberText;
      if (numberData.starPos) {
        const ki = vectorToKi(numberData.starPos);
        starData[ki] = starData[ki] || [];
        starData[ki].push(+numberText);
        numberText = '';
      }
      x += numberData.numberText.length;
      innerTotal += +numberText;
    }
  });
  return Object.keys(starData).reduce((total, ki) => {
    const list = starData[ki];
    if (list.length < 2) {
      return total
    }
    return total + starData[ki].reduce((t, next) => t * next, 1)
  }, 0)
};


console.log('part1:', calcEnginePart1(data));
console.log('part2:', calcEnginePart2(data));
// part1: 528799
// part2: 84907174