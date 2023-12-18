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

const transformData = (text: string) => text.trim().split(',');

const stringToHashNumber = (text: string) => {
  let result = 0;
  for (let i = 0, limit = text.length; i < limit; i++) {
    result += text.charCodeAt(i);
    result *= 17;
    result %= 256;
  }
  return result;
}

const calcTotalHashNumberPart1 = (text: string) => {
  const textList = transformData(text);
  return textList.reduce((total, nextText) => {
    return total + stringToHashNumber(nextText)
  }, 0)
}
const calcTotalHashNumberPart2 = (text: string) => {
  const textList = transformData(text).map((t) => {
    const match = t.match(/(\w+)(.)(\w*)/);
    return [match[1], match[2], match[3]]
  });
  const boxList: ({
    name: string;
    focalLength: number;
  }[])[] = [];
  textList.forEach((charList) => {
    const index = stringToHashNumber(charList[0]);
    const name = charList[0];
    const isDash = charList[1] === '-';
    const focalLength = +charList[2];
    const box = boxList[index] || (boxList[index] = []);
    const oldIndex = box.findIndex((d) => d.name === name);

    if (isDash) {
      if (oldIndex > -1) {
        box.splice(oldIndex, 1)
      }
    } else {
      if (oldIndex > -1) {
        box[oldIndex] = { name, focalLength };
      } else {
        box.push({ name, focalLength })
      }
    }
  });
  return boxList.reduce((total, box, i) => {
    return total + box.reduce((t, data, j) => {
      return t + (i + 1) * (j + 1) * data.focalLength
    }, 0)
  }, 0)
}

console.log('part1:', calcTotalHashNumberPart1(data));
console.log('part2:', calcTotalHashNumberPart2(data));
// part1: 508498
// part2: 279116
