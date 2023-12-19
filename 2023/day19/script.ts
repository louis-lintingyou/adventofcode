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

interface Data {
  x: number;
  m: number;
  a: number;
  s: number;
}

const transformData = (text: string): {
  workflows: {
    [ki: string]: string;
  };
  dataList: Data[]
} => {
  const result = {
    workflows: {},
    dataList: [],
  }
  const list = text.trim().split('\n\n');
  list[0].split('\n').forEach((row) => {
    const colList = row.split('{');
    result.workflows[colList[0]] = colList[1].replace('}', '');
  });
  list[1].split('\n').forEach((row) => {
    const colList = row.replace('{', '').replace('}', '').split(',');
    const data: Data = {
      x: null,
      m: null,
      a: null,
      s: null,
    }
    colList.forEach((col) => {
      const list = col.split('=');
      data[list[0]] = +list[1];
    });
    result.dataList.push(data);
  })
  return result;
}

// px{a<2006:qkq,m>2090:A,rfg}
// pv{a>1716:R,A}
// lnx{m>1548:A,A}
// rfg{s<537:gd,x>2440:R,A}
// qs{s>3448:A,lnx}
// qkq{x<1416:A,crn}
// crn{x>2662:A,R}
// in{s<1351:px,qqz}
// qqz{s>2770:qs,m<1801:hdj,R}
// gd{a>3333:R,R}
// hdj{m>838:A,pv}

// {x=787,m=2655,a=1222,s=2876}
// {x=1679,m=44,a=2067,s=496}
// {x=2036,m=264,a=79,s=2244}
// {x=2461,m=1339,a=466,s=291}
// {x=2127,m=1623,a=2188,s=1013}
// 首先列出工作流程，然後是一個空行，然後是精靈希望您排序的部分的評級。所有部分都從名為 的工作流程開始in。在此範例中，列出的五個部分經歷以下工作流程：


const a = `
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`;

console.log(transformData(a))

// {x=787,m=2655,a=1222,s=2876}: in-> qqz-> qs-> lnx->A
// {x=1679,m=44,a=2067,s=496}: in-> px-> rfg-> gd->R
// {x=2036,m=264,a=79,s=2244}: in-> qqz-> hdj-> pv->A
// {x=2461,m=1339,a=466,s=291}: in-> px-> qkq-> crn->R
// {x=2127,m=1623,a=2188,s=1013}: in-> px-> rfg->A

