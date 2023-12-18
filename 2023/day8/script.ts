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

interface MapData {
  stepList: (0 | 1)[];
  stepMap: {
    [key: string]: string[]
  }
}
const transformData = (text: string): MapData => {
  const l = text.split('\n\n');
  const stepList = l[0].split('').map((t) => t === 'R' ? 1 : 0);
  const stepMap = l[1].split('\n').reduce((stepMap, r) => {
    const stepList = r.split(' = ');
    stepMap[stepList[0]] = stepList[1].match(/\w+/g)
    return stepMap;
  }, {})
  return { stepList, stepMap };
}


// console.log(transformData(data));

const countStepPart1 = (text: string) => {
  const mapData = transformData(text);
  let countStep = 0;
  let step = 'AAA';
  while(step !== 'ZZZ') {
    step = mapData.stepMap[step][mapData.stepList[countStep % mapData.stepList.length]];
    countStep++
  }
  return countStep;
}

// 求最大公约数
const getGreatestCommonDivisor = (a, b) => {
  if (b === 0) {
    return a;
  } else {
    return getGreatestCommonDivisor(b, a % b);
  }
}
const getLeastCommonMultiple = (numList: number[]) => {
  // 求最小公倍数
  const greatestCommonDivisor = numList.reduce((greatestCommonDivisor, num) => {
    return getGreatestCommonDivisor(greatestCommonDivisor, num)
  }, numList[0])
  
  return greatestCommonDivisor * numList.reduce((total, num) => {
    return total * (num / greatestCommonDivisor)
  }, 1);
}



const countStepPart2 = (text: string) => {
  const mapData = transformData(text);
  const stepList = Object.keys(mapData.stepMap).filter((step) => step[2] === 'A');
  const countStepList = stepList.map((step) => {
    let countStep = 0;
    
    while(step[2] !== 'Z') {
      step = mapData.stepMap[step][mapData.stepList[countStep % mapData.stepList.length]];
      countStep++
    }
    return countStep;
  });
  return getLeastCommonMultiple(countStepList);
}

console.log("part1:", countStepPart1(data));
console.log("part2:", countStepPart2(data));

// part1: 11567
// part2: 9858474970153


