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

interface Result { row: number; col: number; };


const transformMap = (text: string): string[][] => text.split('\n').map((r) => r.split(''));
const transformMapData = (text: string): string[][][] => text.trim().split('\n\n').map((d) => transformMap(d));

const calcMapMirrorPart1 = (matrix: string[][]): Result => {
  const colList = [];
  let yMirrorIndexList = [];
  let xMirrorIndexList = [];
  let width = matrix[0].length;
  let height = matrix.length
  matrix.forEach((row, y) => {
    let isMirror = true;
    row.forEach((point: string, x) => {
      colList[x] = (colList[x] || '') + point;
      isMirror = isMirror && matrix[y + 1]?.[x] === point;
    });
    if (isMirror) {
      yMirrorIndexList.push(y);
    }
  });
  colList.forEach((col, x) => {
    if (col === colList[x + 1]) {
      xMirrorIndexList[x] = x;
    }
  });
  let yIndex = yMirrorIndexList
    .filter((y) => {
      let mirrorTopIndex = y;
      let mirrorBottomIndex = y + 1;
      while (mirrorTopIndex >= 0 && mirrorBottomIndex < height) {
        if (matrix[mirrorTopIndex].join('') !== matrix[mirrorBottomIndex].join('')) {
          return false
        }
        mirrorTopIndex--;
        mirrorBottomIndex++;
      }
      return true;
    })[0]

  let xIndex = xMirrorIndexList
    .filter((x) => {
      let mirrorLeftIndex = x;
      let mirrorRightIndex = x + 1;
      while (mirrorLeftIndex >= 0 && mirrorRightIndex < width) {
        if (colList[mirrorLeftIndex] !== colList[mirrorRightIndex]) {
          return false
        }
        mirrorLeftIndex--;
        mirrorRightIndex++;
      }
      return true;
    })[0]
    
  return {
    col: typeof xIndex === 'number' ? xIndex + 1 : 0,
    row: typeof yIndex === 'number' ? yIndex + 1 : 0,
  }
}

const calcMapMirrorPart2 = (matrix: string[][]): Result => {
  const colList: string[][] = [];
  let yMirrorIndexList = [];
  let xMirrorIndexList = [];
  let width = matrix[0].length;
  let height = matrix.length
  matrix.forEach((row, y) => {
    let diffLength = row.length;
    row.forEach((point: string, x) => {
      colList[x] = (colList[x] || []);
      colList[x].push(point)
      diffLength -= +!!(matrix[y + 1]?.[x] === point);
    });
    if (diffLength <= 1) {
      yMirrorIndexList.push(y);
    }
  });
  
  colList.forEach((col, x) => {
    let diffLength = col.length;
    col.forEach((point, y) => {
      diffLength -= +!!(colList[x + 1]?.[y] === point);
    });
    if (diffLength <= 1) {
      xMirrorIndexList[x] = x;
    }
  });
  
  let yIndex = yMirrorIndexList
    .filter((y) => {
      let mirrorTopIndex = y;
      let mirrorBottomIndex = y + 1;
      let diffLength = 0;
      while (mirrorTopIndex >= 0 && mirrorBottomIndex < height) {
        diffLength += matrix[mirrorTopIndex].reduce((total, text, index) => {
          return total + +(text !== matrix[mirrorBottomIndex][index])
        }, 0)
        if (diffLength > 1) {
          return false
        }
        mirrorTopIndex--;
        mirrorBottomIndex++;
      }
      return diffLength === 1;
    })[0];
  let xIndex = xMirrorIndexList
    .filter((x) => {
      let mirrorLeftIndex = x;
      let mirrorRightIndex = x + 1;
      let diffLength = 0
      while (mirrorLeftIndex >= 0 && mirrorRightIndex < width) {
        diffLength += colList[mirrorLeftIndex].reduce((total, text, index) => {
          return total + +(text !== colList[mirrorRightIndex][index])
        }, 0);
        
        if (diffLength > 1) {
          return false
        }
        mirrorLeftIndex--;
        mirrorRightIndex++;
      }
      return diffLength === 1;
    })[0];
    
  return {
    col: typeof xIndex === 'number' ? xIndex + 1 : 0,
    row: typeof yIndex === 'number' ? yIndex + 1 : 0,
  }
}

const calcTotalNumber = (text: string, calcMapMirrorFn: (matrix: string[][]) => Result) => {
  const matrixList = transformMapData(text);
  const countData = matrixList.reduce((totalData, matrix) => {
    const data = calcMapMirrorFn(matrix);
    // console.log(data);
    
    totalData.row += data.row;
    totalData.col += data.col;
    return totalData;
  }, { row: 0, col: 0 });
  
  return countData.row * 100 + countData.col
}

console.log("part1:", calcTotalNumber(data, calcMapMirrorPart1));
console.log("part2:", calcTotalNumber(data, calcMapMirrorPart2));
// part1: 36041
// part2: 35915