const fs = require('fs');
const path = require('path');

// 定義 TypeScript 檔案的路徑
const tsFilePath = path.join(__dirname, './data.txt');

// 使用 fs.readFile 讀取 TypeScript 檔案
const data = fs.readFileSync(tsFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading TypeScript file:', err);
    return;
  }
  return data;
});

const part1NumberMapping = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
}

const part2NumberMapping = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    one: 1, 
    two: 2, 
    three: 3, 
    four: 4, 
    five: 5, 
    six: 6, 
    seven: 7, 
    eight: 8,
    nine: 9
}



const calibrationValue = (text, mapping, kiList) => {
    if (!text) {
        return 0;
    }
    let firstIndex = Infinity;
    let lastIndex = -Infinity;
    let firstNum = '';
    let lastNum = '';
    for (let i = 0, max = kiList.length; i < max; i++) {
        const num = kiList[i];
        const minIndex = text.indexOf(num);
        const maxIndex = text.lastIndexOf(num);
        if (minIndex !== -1 && minIndex < firstIndex) {
            firstIndex = minIndex;
            firstNum = num;
        }
        if (maxIndex !== -1 && maxIndex > lastIndex) {
            lastIndex = maxIndex;
            lastNum = num;
        }
    }
    return mapping[firstNum] * 10 + mapping[firstIndex === lastIndex ? firstNum : lastNum]
}


const calcValuePart1 = (data) => {
    const valueList = (data || '').trim().split('\n');
    const kiList = Object.keys(part1NumberMapping);
    return valueList.reduce((total, next) => {
        return total + calibrationValue(next, part1NumberMapping, kiList);
    }, 0)
}

const calcValuePart2 = (data) => {
    const valueList = (data || '').trim().split('\n');
    const kiList = Object.keys(part2NumberMapping);
    return valueList.reduce((total, next) => {
        return total + calibrationValue(next, part2NumberMapping, kiList);
    }, 0)
}

console.log('part1:', calcValuePart1(data));
console.log('part2:', calcValuePart2(data));
// part1: 53194
// part2: 54249
