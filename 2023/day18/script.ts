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

const transformData = (text: string) => text.split('\n').map((t) => t.split(' '));


// U up
// D down
// L left
// R right

const calcDig = (text: string) => {
  const dataList = transformData(text);
  let x = 0;
  let y = 0;
  let matrix = [];
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
  });
  console.log(matrix.map(r => [...r].map((t) => t || '.').join('')).join('\n'));
  
  return matrix.reduce((total, row) => {
    let prevIndex = null;
    let isNeedCount = false;
    
    for (let i = 0, limit = row.length; i < limit; i++) {
      if (row[i] === '#') {
        if (isNeedCount) {
          total += i - prevIndex;
        } else {
          total += 1
        }
        prevIndex = i;
        isNeedCount = !isNeedCount
      }
    }
    return total
  }, 0);
  

}

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

console.log(calcDig(a))
// 44578
// 58396

