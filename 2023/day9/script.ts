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


const transformData = (text: string): number[][] => {
  return text.split('\n').map((row) => row.split(' ').map((t) => +t))
}
const getDiffListList = (numberList: number[][]): number[][][] => {
  const reuseList: number[][][] = []
  numberList.forEach((list) => {
    const diffListList: number[][] = [];
    diffListList.push(list);
    let isHasNum = true;
    let calcList = list;
    while (isHasNum) {
      isHasNum = false;
      const diffList = [];
      
      for (let i = 0, max = calcList.length - 1; i < max; i++) {
        const diff = calcList[i + 1] - calcList[i];
        isHasNum = isHasNum || !!diff;
        diffList.push(diff);
      }
      if (isHasNum) { 
        calcList = diffList;
        diffListList.push(diffList);
      }
    }
    let num = 0;
    
    for (let i = diffListList.length - 1; i >=0; i--) {
      const diffList = diffListList[i];
      num += diffList[diffList.length - 1];
    }
    reuseList.push(diffListList)
  });
  return reuseList;
}
const calcDataPart1 = (text: string): number => {
  const numberList = transformData(text);
  const diffListList: number[][][] = getDiffListList(numberList);
  return diffListList.reduce((total, list) => {
    let num = 0;
    for (let i = list.length - 1; i >=0; i--) {
      const innerList = list[i];
      num += innerList[innerList.length - 1];
    }
    return total + num;
  }, 0);
};
const calcDataPart2 = (text: string): number => {
  const numberList = transformData(text);
  const diffListList: number[][][] = getDiffListList(numberList);
  
  return diffListList.reduce((total, list) => {
    let num = 0;
    let diff = 0;
    for (let i = list.length - 1; i >= 0; i--) {
      num = (list[i][0] - num);
      diff += num;
    }
    
    return total + num;
  }, 0);
};

console.log("part1:", calcDataPart1(data));
console.log("part2:", calcDataPart2(data));
// part1: 1696140818
// part2: 1152

