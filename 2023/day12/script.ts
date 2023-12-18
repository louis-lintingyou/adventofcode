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

const transformData = (data): {
  text: string;
  poundSignList: number[];
}[] => {
  return data.trim()
    .split('\n')
    .map((row) => row.split(' '))
    .map((row) => ({
      text: row[0],
      poundSignList: row[1].split(',').map((t) => +t)
    }))
}

const getAllArrangement = (dot, poundSignList: string[], text = '', arrangementList = []): string[] => {
  if (dot === 0 && poundSignList.length === 0) {
    arrangementList.push(text);
  } 
  if (dot > 0) {
    // 放一顆球到一個籃子
    getAllArrangement(dot - 1, poundSignList, text + '.', arrangementList);
  } 
  if (poundSignList.length > 0 && text[text.length - 1] !== '#') {
    const newPoundSignList = [...poundSignList]
    const poundSign = newPoundSignList.shift();
    // 不放球，但換下一個籃子
    getAllArrangement(dot, newPoundSignList, text + poundSign, arrangementList);
  }
  return arrangementList;
}

const getRowTotal = (text: string, poundSignList: number[]): number => {
  const allLength = text.length;
  const poundSignLength = poundSignList.reduce((t, n) => t + n, 0);
  const arrangementList = getAllArrangement(
    allLength - poundSignLength, 
    poundSignList.map((n) => '#'.repeat(n))
  );
  let total = arrangementList.filter((arrangement) => {
    for (let i = 0; i < allLength; i++) {
      if (text[i] === '?') {
        continue;
      }
      if (text[i] !== arrangement[i]) {
        return false;
      }
    }
    return true;
  }).length;
  return total;
}
const calcAllArrangemenPart1 = (text: string) => {
  const dataList = transformData(text);

  return dataList.reduce((total, row) => {
    const text = row.text;
    const poundSignList = row.poundSignList;
    const rowTotal = getRowTotal(text, poundSignList);
    return total + rowTotal
  }, 0)
};

const _calcAllArrangemenPart2 = (text: string) => {
  const dataList = transformData(text);

  return dataList.reduce((total, row) => {
    const text = row.text;
    const firstChar = text[0];
    const lastChar = text[text.length - 1];
    const poundSignList = row.poundSignList;
    const firstPoundSign = poundSignList[0];
    const lastPoundSign = poundSignList[poundSignList.length - 1];
    const oneRowTotal = getRowTotal(text, poundSignList);
    // const twoRowTotal = getRowTotal(`${text}?${text}`, [...poundSignList, ...poundSignList]);
    // const multiple = twoRowTotal / oneRowTotal;
    // console.log(text, multiple);
    
    const isEndMatch = text.match(new RegExp(`${'#'.repeat(lastPoundSign)}$`));
    let startRowTotal: number;
    let middleRowTotal: number;
    let endRowTotal: number;
    if (isEndMatch) {
      startRowTotal = getRowTotal(`${text}`, poundSignList);
      middleRowTotal = getRowTotal(`.${text}`, poundSignList);
      endRowTotal = middleRowTotal;
    } else {
      let nextTextPoundSign = '';
      let prevTextPoundSign = '';
      startRowTotal = getRowTotal(`${text}?`, poundSignList);
      let i = 0;
      while (i < lastPoundSign) {
        if (text[i] !== '?') {
          break;
        }
        if (text[i + 1] === '#') {
          break;
        }
        nextTextPoundSign += '?';
        i++;
      };
      let j = text.length - 1;
      while (j >= text.length - firstPoundSign) {
        if (text[j] !== '?') {
          break;
        }
        if (text[j - 1] === '#') {
          break;
        }
        prevTextPoundSign += '?';
        j--;
      };
      // console.log(nextTextPoundSign.length, prevTextPoundSign.length);
      // console.log(`${prevTextPoundSign}?${text}?${nextTextPoundSign}`);
      // // const a = Math.min(nextTextPoundSign.length, prevTextPoundSign.length) || 1;
      
      middleRowTotal = getRowTotal(`${prevTextPoundSign}?${text}?${nextTextPoundSign}`, poundSignList);
      // middleRowTotal = getRowTotal(`${prevTextPoundSign}?${text}?`, poundSignList);
      endRowTotal = getRowTotal(`${prevTextPoundSign}?${text}`, poundSignList);
      // console.log(startRowTotal, middleRowTotal, endRowTotal);
      
    } 
    
    // console.log(isStartMatch, isEndMatch);
    
    // const middleRowTotal = isStartMatch
    //   ? getRowTotal(`${text}?`, poundSignList)
    //   : isEndMatch
    //   ? getRowTotal(`?${text}`, poundSignList)
    //   : getRowTotal(`?${text}?`, poundSignList);
    
    // const endRowTotal = getRowTotal(`?${text}`, poundSignList);
    const rowTotal = startRowTotal * middleRowTotal ** 3 * endRowTotal; 
    // // const rowTotal2 = firstRowTotal * (other2RowTotal ** 2);
    
    // console.log(row, rowTotal);
    
    return total + rowTotal
  }, 0)
};

const __calcAllArrangemenPart2 = (text: string) => {
  const dataList = transformData(text);

  return dataList.reduce((total, row) => {
    const text = row.text;
    const poundSignList = row.poundSignList;
    const common = getRowTotal(text, poundSignList);
    const oneRowTotal1 = getRowTotal(`?${text}`, poundSignList);
    const oneRowTotal2 = getRowTotal(`${text}?`, poundSignList);
    // const oneRowTotal3 = getRowTotal(`?${text}?`, poundSignList);

    const stratPoundSign = poundSignList[0];
    const lastPoundSign = poundSignList[poundSignList.length - 1];
    const isStartMatch = text.match(new RegExp(`${'#'.repeat(stratPoundSign)}$`));
    const isEndMatch = text.match(new RegExp(`${'#'.repeat(lastPoundSign)}$`));

    console.log(text, poundSignList);
    // console.log(common, oneRowTotal1, oneRowTotal2, oneRowTotal3);
    
    let rowTotal;
    if (isStartMatch && isEndMatch) {
      rowTotal = common ** 5;
    } else if (1) {

    } else {
      if (oneRowTotal1 > oneRowTotal2) {
        rowTotal = common * (oneRowTotal1 ** 4);
      } else {
        rowTotal = common * (oneRowTotal2 ** 4);
      }
      console.log(rowTotal);
    }
    
    return total + rowTotal;
  }, 0)
};

const calcAllArrangemenPart2 = (text: string) => {
  const dataList = transformData(text);

  return dataList.reduce((total, row) => {
    const text = row.text;
    const poundSignList = row.poundSignList;
    const common = getRowTotal(text, poundSignList);
    const oneRowTotal1 = getRowTotal(`${text}?${text}`, poundSignList);
    const oneRowTotal2 = getRowTotal(`${text}?`, poundSignList);
    // const oneRowTotal3 = getRowTotal(`?${text}?`, poundSignList);

    const stratPoundSign = poundSignList[0];
    const lastPoundSign = poundSignList[poundSignList.length - 1];

    let rowTotal;
    
    return total + rowTotal;
  }, 0)
};

const a = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`

'###.##..# 3,2,1'
'??##???? 2,1'
// 使用範例
// console.log("part1:", calcAllArrangemenPart1(a));
// console.log("part2:", calcAllArrangemenPart2(a));
// console.log("part2:", calcAllArrangemenPart2(data));
// part1: 7843
// part2: 7843

console.log("part1:", calcAllArrangemenPart1('??##???? 2,1'));
console.log("part1:", calcAllArrangemenPart1('??##???????##???? 2,1,2,1'));
console.log("part1:", calcAllArrangemenPart1('??##???????##???????##???? 2,1,2,1,2,1'));
console.log("part1:", calcAllArrangemenPart1('??##???????##???????##???????##???? 2,1,2,1,2,1,2,1'));
console.log('----');
console.log("part1:", calcAllArrangemenPart1('????#??? 2,1'));
console.log("part1:", calcAllArrangemenPart1('????#????????#??? 2,1,2,1'));
console.log("part1:", calcAllArrangemenPart1('????#????????#????????#??? 2,1,2,1,2,1'));
console.log("part1:", calcAllArrangemenPart1('????#????????#????????#????????#??? 2,1,2,1,2,1,2,1'));

// 10328345009141
// 15939785011795564
// 8023972245637
// console.log(calcAllArrangemenPart1('.??..??...?##. 1,1,3,1,1,3'));
// console.log(calcAllArrangemenPart1('.??..??...?##.?.??..??...?##. 1,1,3,1,1,3'));
// console.log(calcAllArrangemenPart1('.??..??...?##.?.??..??...?##.?.??..??...?##. 1,1,3,1,1,3,1,1,3'));
// console.log('------');
// console.log(calcAllArrangemenPart1('?#?#?#?#?#?#?#? 1,3,1,6'));
// console.log(calcAllArrangemenPart1('?#?#?#?#?#?#?#???#?#?#?#?#?#?#? 1,3,1,6,1,3,1,6'));
// console.log('------');
// console.log(calcAllArrangemenPart1('?###???????? 3,2,1'));
// console.log(calcAllArrangemenPart1('?###????????? 3,2,1'));
// console.log(calcAllArrangemenPart1('?###??????????###???????? 3,2,1,3,2,1'));
// console.log(calcAllArrangemenPart1('?###??????????###??????????###???????? 3,2,1,3,2,1,3,2,1'));

// console.log('###..###.####.###'.match(/(^###[^#])|([^#]###[^#])|([^#]###$)/g))

// 012345 = 6
// 