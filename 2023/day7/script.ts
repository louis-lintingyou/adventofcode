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

const transformData = (text: string): (string | number)[][] => {
    return text.split('\n').map((row) => {
        const l = row.split(' ');
        return [l[0], +l[1]]
    })
}
const TypeMapping = {
    '11111': 0,
    '2111': 1,
    '1211': 1,
    '1121': 1,
    '1112': 1,
    '122': 2,
    '212': 2,
    '221': 2,
    '311': 3,
    '131': 3,
    '113': 3,
    '23': 4,
    '32': 4,
    '14': 5,
    '41': 5,
    '5': 6
};
const CharMappingPart1 = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
} 
const CharMappingPart2 = {
    ...CharMappingPart1,
    'J': 1
} 
const compareCardByChar = (
    card1: string, 
    card2: string, 
    mapping: { [k: string]: number }
): number => {
    for (let i = 0; i < 5; i++) {
        const char1 = mapping[card1[i]];
        const char2 = mapping[card2[i]];
        if (char1 !== char2) {
            return char1 - char2
        }
    }
    return 0
}
const compareCard = (
    getCardTypeFn: (text: string) => number, 
    charMapping: { [k: string]: number }, 
    card1: string, 
    card2: string
): number => {
    const type1 = getCardTypeFn(card1);
    const type2 = getCardTypeFn(card2);
    if (type1 !== type2) {
        return type1 - type2;
    }
    return compareCardByChar(card1, card2, charMapping);
}

const calcTotalWinnings = (text: string, compareFn: (a: string, b: string) => number) => {
    const dataList = transformData(text).sort((a, b) => compareFn(a[0] as string, b[0] as string));
    return dataList
        
        .reduce((total, next, i) => {
            return total + (next[1] as number) * (i + 1)
        }, 0)
}
const getCardTypePart1 = (card: string): number => {
    const charMap = {};
    for (let i = 0; i < 5; i ++) {
        const char = card[i];
        charMap[char] = (charMap[char] || 0) + 1;
    };
    return TypeMapping[Object.keys(charMap).reduce((t, next) => `${t}${charMap[next]}`, '')]
}
const getCardTypePart2 = (card: string): number => {
    if (card === 'JJJJJ') {
        return TypeMapping['5']
    }
    const charMap = {};
    let countJ = 0;
    for (let i = 0; i < 5; i ++) {
        const char = card[i];
        if (char === 'J') {
            countJ++;
            continue;
        }
        charMap[char] = (charMap[char] || 0) + 1;
    };
    const moristChar = Object.keys(charMap).reduce((morist, char) => {
        if (morist === null) {
            return char
        };
        return charMap[char] > charMap[morist] ? char : morist;
    }, null);
    charMap[moristChar] += countJ;

    return TypeMapping[Object.keys(charMap).reduce((t, next) => `${t}${charMap[next]}`, '')];
}

console.log("part1:", calcTotalWinnings(data, (...arg) => 
    compareCard(getCardTypePart1, CharMappingPart1, ...arg))
);
console.log("part2:", calcTotalWinnings(data, (...arg) => 
    compareCard(getCardTypePart2, CharMappingPart2, ...arg))
);
// part1: 245794640
// part2: 247899149
