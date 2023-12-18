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

interface RowData {
    index: number;
    winningNumberList: number[];
    numberList: number[];
}

const textToNumberList = (text) => text.split(' ').filter((t) => t).map((t) => +t)
const cardText2Data = (text: string): RowData => {
    const textList = text.split(': ');
    const numberGroup = textList[1].split(' | ');
    return {
        index: (+textList[0].match(/\d+$/)[0]),
        winningNumberList: textToNumberList(numberGroup[0]),
        numberList: textToNumberList(numberGroup[1])
    }
}
         
const countTimes = (row: RowData) => row.numberList.filter((num) => row.winningNumberList.includes(num)).length;
const calcPointsPart1 = (data: string) => {
    const rowList = (data || "").split("\n").map((row) => cardText2Data(row));
    return rowList.reduce((total, row) => {
        const times = countTimes(row);
        
        return total + (times ? 2 ** (times - 1) : 0);
    }, 0);
}

const calcPointsPart2 = (data: string) => {
    const rowList = (data || "").split("\n").map((row) => cardText2Data(row));
    const instancesList = [];

    return rowList.reduce((total, row, i) => {
        const times = countTimes(row);
        const all = 1 + (instancesList[i] || 0);
        let instanceIndex = i + times;
        while (instanceIndex > i) {
            instancesList[instanceIndex] = (instancesList[instanceIndex] || 0) + all;
            instanceIndex--;
        }
        return total + all;
    }, 0);
}

console.log('part1:', calcPointsPart1(data));
console.log('part2:', calcPointsPart2(data));
// part1: 22488
// part2: 7013204


