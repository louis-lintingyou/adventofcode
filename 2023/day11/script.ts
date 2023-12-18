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

const transformData = (text: string) => {
  return text.trim().split('\n').map((r) => r.split(''));
}

const countDistance = (text: string, times = 1) => {
  const space = transformData(text);
  const needAddXList = [...Array(space[0].length)].map(() => true);
  const needAddYList = [...Array(space.length)].map(() => false);
  const starMap = [];
  space.forEach((xRow, y) => {
    let isHasStar = false;
    xRow.forEach((point, x) => {
      if (point === '#') {
        isHasStar = true;
        needAddXList[x] = false;
        starMap.push({ x, y });
      }
    });
    if (!isHasStar) {
      needAddYList[y] = true;
    }
  });
  let totalDistance = 0;
  for (let i = 0; i < starMap.length; i++) {
    for (let j = i + 1; j < starMap.length; j++) {
      let x = Math.min(starMap[i].x, starMap[j].x);
      let endX = Math.max(starMap[i].x, starMap[j].x);
      let y = Math.min(starMap[i].y, starMap[j].y);
      let endY = Math.max(starMap[i].y, starMap[j].y);
      for (x; x < endX; x++) {
        if (needAddXList[x]) {
          totalDistance += 1 * times
        } else {
          totalDistance += 1
        }
      }
      for (y; y < endY; y++) {
        if (needAddYList[y]) {
          totalDistance += 1 * times
        } else {
          totalDistance += 1
        }
      }
    }
  }
  return totalDistance;
}

console.log("part1:", countDistance(data, 2));
console.log("part2:", countDistance(data, 1000000));
// part1: 10292708
// part2: 790194712336


