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


const transformData = (text: string) => text.trim().split('\n').map((r) => r.split(''));

const moveLoadY = (floor: string[][], isRever: boolean) => {
  const stopYPostion = isRever ? floor.length - 1 : 0;
  const diff = isRever ? -1 : 1;
  const stopYPostionList = floor[0].map(() => stopYPostion);

  for (let y = stopYPostion; isRever ? (y >= 0) : (y < floor.length); y += diff) {
    const row = floor[y];
    for (let x = 0; x < row.length; x++) {
      const point = row[x]
      if (point === '#') {
        stopYPostionList[x] = y + diff;
      } else if (point === 'O') {
        row[x] = '.';
        floor[stopYPostionList[x]][x] = 'O';
        stopYPostionList[x] += diff;
      }
    }
  }
  return floor;
}

const moveLoadX = (floor: string[][], isRever: boolean) => {
  const stopXPostion = isRever ? floor[0].length - 1 : 0;
  const diff = isRever ? -1 : 1;
  const stopXPostionList = floor.map(() => stopXPostion);

  for (let x = stopXPostion; isRever ? x >= 0 : x < floor[0].length; x += diff) {
    for (let y = 0; y < floor.length; y++) {
      const row = floor[y];
      const point = row[x]
      if (point === '#') {
        stopXPostionList[y] = x + diff;
      } else if (point === 'O') {
        row[x] = '.';
        floor[y][stopXPostionList[y]] = 'O';
        stopXPostionList[y] += diff;
      }
    }
  }
  // console.log(floor.map(r => r.join('')).join('\n'));
  
  return floor;
}

const calcTotalLoadPart1 = (text: string) => {
  const floor = transformData(text);
  moveLoadY(floor, false)
  return floor.reduce((total, row, y) => {
    return total + row.filter((point) => point === 'O').length * (floor.length - y);
  }, 0)
}

const calcTotalLoadPart2 = (text: string) => {
  let total: number;
  const floor = transformData(text);
  const cycleCacheList = [];
  for (let i = 0; i < 1000; i++) {
    moveLoadY(floor, false);
    // console.log(floor.map(r => r.join('')).join('\n'));
    // console.log('--');
    moveLoadX(floor, false);
    // console.log(floor.map(r => r.join('')).join('\n'));
    // console.log('--');
    moveLoadY(floor, true);
    // console.log(floor.map(r => r.join('')).join('\n'));
    // console.log('--');
    moveLoadX(floor, true);
    // console.log(floor.map(r => r.join('')).join('\n'));
    // console.log('--');
    total = floor.reduce((total, row, y) => {
      return total + row.filter((point) => point === 'O').length * (floor.length - y);
    }, 0);
    cycleCacheList.push(total)
    // console.log(total);
  }

  return total
}

const a = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`
console.log("part1:", calcTotalLoadPart1(data));
console.log("part2:", calcTotalLoadPart2(data)); // TODO: 這題解得莫名其妙
// part1: 109939
// part2: 101010
