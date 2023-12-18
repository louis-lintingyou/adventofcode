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

interface RaceData {
  time: number;
  distance: number;
}

const stringToDataListPart1 = (text: string): RaceData[] => {
  const rowList = text.trim().split('\n').map((row) => row.split(/\W+/));
  return [...new Array(rowList[0].length - 1)]
    .map((_, i) => ({
      time: +rowList[0][i + 1],
      distance: +rowList[1][i + 1],
    }));
};

const stringToDataListPart2 = (text: string): RaceData[] => {
  const rowList = text.trim().split('\n').map((row) => row.split(/:\W+/));
  return [
    {
      time: +rowList[0][1].replace(/\W/g, ''),
      distance: +rowList[1][1].replace(/\W/g, ''),
    }
  ];
};


const calcSpeed = (text: string, transformFn: (text: string) => RaceData[]): number => {
  const raceDataList = transformFn(text);
  return raceDataList.reduce((num, nextData) => {
    let ways = 0;
    let time: number = nextData.time;
    let distance: number = nextData.distance;
    let i = 1;
    while (i++ < time) {
      ways += +!!((time - i) * i > distance);
    }
    return num * ways;
  }, 1)
}


console.log("part1:", calcSpeed(data, stringToDataListPart1));
console.log("part2:", calcSpeed(data, stringToDataListPart2)); 
// part1: 1660968
// part2: 26499773