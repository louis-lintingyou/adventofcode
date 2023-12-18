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
  seeds: number[];
  seedToSoil: number[][];
  soilToFertilizer: number[][];
  fertilizerToWater: number[][];
  waterToLight: number[][];
  lightToTemperature: number[][];
  temperatureToHumidity: number[][];
  humidityToLocation: number[][];
}

const stringToMap = (text: string): number[][] => {
  return text
    .split("map:\n")[1]
    .split("\n")
    .map((row) => row.split(" ").map((t) => +t));
};
const stringToData = (text: string): MapData => {
  const splitByPart = text.trim().split(/\n\n/);
  return {
    seeds: splitByPart[0]
      .split(": ")[1]
      .split(" ")
      .map((t) => +t),
    seedToSoil: stringToMap(splitByPart[1]),
    soilToFertilizer: stringToMap(splitByPart[2]),
    fertilizerToWater: stringToMap(splitByPart[3]),
    waterToLight: stringToMap(splitByPart[4]),
    lightToTemperature: stringToMap(splitByPart[5]),
    temperatureToHumidity: stringToMap(splitByPart[6]),
    humidityToLocation: stringToMap(splitByPart[7]),
  };
};
const FindStepList = [
  "seedToSoil",
  "soilToFertilizer",
  "fertilizerToWater",
  "waterToLight",
  "lightToTemperature",
  "temperatureToHumidity",
  "humidityToLocation",
];

const findNextNumberByNumber = (num: number, mapList: number[][]) => {
  const nextMap = mapList.find((map: number[]) => {
    return num >= map[1] && num < map[1] + map[2];
  });
  return nextMap ? nextMap[0] + (num - nextMap[1]) : num;
};

const findLowestLocationPart1 = (text: string): number => {
  const mapData = stringToData(text);
  const locationList = mapData.seeds.map((seed) => {
    return FindStepList.reduce((num, name) => {
      return findNextNumberByNumber(num, mapData[name]);
    }, seed);
  });
  return Math.min(...locationList);
};
// 計算跑的次數
let countTimes = 0;
const findLowestLocationWithAccuracy = (
  mapData: MapData,
  accuracyList: number[]
): number => {
  const seeds = mapData.seeds;
  const innerAccuracyList = [...accuracyList];
  const Accuracy = innerAccuracyList.shift();
  let lowestLocation = Infinity;
  let minSeed: number;
  let minSeedGroup: number;

  for (let i = 0, max = seeds.length; i < max; i += 2) {
    const nextSeedLimit = seeds[i + 1];
    if (!nextSeedLimit) {
      continue;
    }
    let seed = seeds[i];
    let seedLimit = seed + nextSeedLimit;
    let prevLocation = null;
    while (seed < seedLimit) {
      countTimes++;
      const nextLocation = Math.min(
        FindStepList.reduce((num, name) => {
          return findNextNumberByNumber(num, mapData[name]);
        }, seed)
      );
      prevLocation = nextLocation;
      if (nextLocation < lowestLocation) {
        lowestLocation = nextLocation;
        minSeed = seed;
        minSeedGroup = i;
      }
      lowestLocation = Math.min(nextLocation, lowestLocation);
      process.stdout.write("\r" + countTimes + ", seed " + seed);
      seed += Accuracy;
    }
    console.log(
      `\n${seeds[i]} done; Accuracy: ${Accuracy}; lowest: ${lowestLocation}; seed: ${minSeed}; group: ${minSeedGroup};`
    );
  }
  if (innerAccuracyList.length) {
    const newMapData = {
      ...mapData,
      seeds: [minSeed - Accuracy, Accuracy * 2],
    };
    return findLowestLocationWithAccuracy(newMapData, innerAccuracyList);
  }
  return lowestLocation;
};
const findLowestLocationPart2 = (text: string): number => {
  const mapData = stringToData(text);
  return findLowestLocationWithAccuracy(mapData, [1000, 5, 1]);
};

console.log("part1:", findLowestLocationPart1(data));
console.log("part2:", findLowestLocationPart2(data));
// part1: 173706076
// part2: 11611182
