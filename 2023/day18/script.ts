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

const transformData = (text: string) => text.trim().split('\n').map((t) => t.split(' '));


// U up
// D down
// L left
// R right

const calcDig = (text: string) => {
  const dataList = transformData(text);
  let x = 0;
  let y = 0;
  let matrix = [];
  const posList = [];

  dataList.forEach((data) => {
    const direction = data[0];
    let stepLength = +data[1];
    if (direction === 'U' || direction === 'D') {
      let diff = direction === 'U' ? -1 : 1;
      while (stepLength > 0) {
        y += diff;
        let row = matrix[y] || (matrix[y] = []);
        row[x] = '#';
        stepLength--;
      }
    } else {
      let diff = direction === 'L' ? -1 : 1;
      let row = matrix[y] || (matrix[y] = []);
      while (stepLength > 0) {
        x += diff;
        row[x] = '#';
        stepLength--;
      }
    }
    posList.push({ x, y });
  });

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  posList.forEach((pos) => {
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
    maxX = Math.max(maxX, pos.x);
    maxY = Math.max(maxY, pos.y);
  });
  console.log(posList);
  
  const checkData = {};
  const checkList = [];
  for (let i = minX; i <= maxX; i ++) {
    checkList.push(
      { x: i , y: minY },
      { x: i , y: maxY },
    )
  }
  for (let i = minY; i <= maxY; i ++) {
    checkList.push(
      { x: minX , y: i },
      { x: maxX , y: i },
    )
  }
  while(checkList.length) {
    const pos = checkList.shift();
    const ki = `${pos.x},${pos.y}`;    
    if (
      matrix[pos.y]?.[pos.x] === '#' || 
      checkData[ki] || 
      pos.x < minX ||
      pos.y < minY ||
      pos.x > maxX ||
      pos.y > maxY
    ) {
      continue;
    }
    checkData[ki] = true;
    checkList.push(
      { x: pos.x + 1, y: pos.y },
      { x: pos.x - 1, y: pos.y },
      { x: pos.x, y: pos.y + 1 },
      { x: pos.x, y: pos.y - 1 },
    )
  }
  return (maxY - minY + 1) * (maxX - minX + 1) - Object.keys(checkData).length;
}
// #######
// #######
// #######
// ..#####
// ..#####
// #######
// #####..
// #######
// .######
// .######


// { x: 0, y: 0 }     { x: 7, y: 0 }
// { x: 0, y: 3 }
// { x: 3, y: 3 }
// { x: 3, y: 7 }     { x: 7, y: 6 }
// { x: 0, y: 7 }     { x: 4, y: 6 }
// { x: 0, y: 9 }     { x: 4, y: 9 }
// { x: 2, y: 9 }     { x: 7, y: 9 }
// { x: 2, y: 12 }    { x: 7, y: 12 }
                   
const aaa = [
  { x: 0, y: 0 }, { x: 7, y: 0 },
  { x: 7, y: 6 }, { x: 4, y: 6 },
  { x: 4, y: 9 }, { x: 7, y: 9 },
  { x: 7, y: 12 }, { x: 2, y: 12 },
  { x: 2, y: 9 }, { x: 0, y: 9 },
  { x: 0, y: 6 }, { x: 3, y: 6 },
  { x: 0, y: 3 }, { x: 0, y: 0 }
]
const aaa3 = [
  { x: 0, y: 0 }, { x: 7, y: 0 },
  { x: 7, y: 6 }, { x: 4, y: 6 },
  { x: 4, y: 9 }, { x: 7, y: 9 },
  { x: 7, y: 12 }, { x: 2, y: 12 },
  { x: 2, y: 9 }, { x: 0, y: 9 },
  { x: 0, y: 6 }, { x: 2, y: 6 },
  { x: 2, y: 3 }, { x: 0, y: 3 }, 
  { x: 0, y: 0 }
]


console.log(
  aaa.reduce((total, pos, i) => {
    let j = i + 1;
    if (j === aaa.length) {
      return total;
    }
    return total + (pos.x * aaa[j].y - pos.y * aaa[j].x)
  }, 0) / 2
)



const a = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`

console.log('part1:', calcDig(a))
// part1: 49897

