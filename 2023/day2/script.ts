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

// exp: Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// {
//     index: 1,
//     setList: [
//         [ ["3", "blue"], ["4", "red"] ], 
//         [ ["1", "red"], ["2", "green"], ["6", "blue"] ], 
//         [ ["2", "green"] ]
//     ]
// }
const gameText2Data = (text) => {
    const textList = text.split(': ');
    return {
        index: (+textList[0].match(/\d+$/)[0]),
        setList: textList[1].split('; ').map((set) => 
            set.split(', ').map((t) => t.split(' '))
        )
    }
}


const Part1LimitData = {
    red: 12,
    green: 13,
    blue: 14
}

const calcMatchGamesPart1 = (data) => {
    const gameList = (data || '').trim().split('\n').map(gameText2Data);

    return gameList.reduce((total, nextData) => {
        if (nextData.setList.every(
            (set) => set.every((trun) => (+trun[0] <= Part1LimitData[trun[1]]))
        )) {
            return total + nextData.index;
        }
        return total
    }, 0)
}

const calcMatchGamesPart2 = (data) => {
    const gameList = (data || '').trim().split('\n').map(gameText2Data);

    return gameList.reduce((total, nextData) => {
        const data = {
            red: 0,
            green: 0,
            blue: 0,
        }
        nextData.setList.forEach((set) => {
            set.forEach((trun) => {
                const ki = trun[1];
                data[ki] = Math.max(data[ki], +trun[0])
            })
        })
        return total + data.red * data.green * data.blue
    }, 0)
}

console.log('part1:', calcMatchGamesPart1(data));
console.log('part2:', calcMatchGamesPart2(data));
// part1: 2679
// part2: 77607