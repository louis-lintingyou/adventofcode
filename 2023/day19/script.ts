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
type Workflow<T = string> = T | Workflow<T>[];

const stringToWorkflow = (text: string): Workflow => {
  const i = text.indexOf(':');
  if (i < 0) {
    return text;
  }
  let length = 0;
  let j = i + 1;
  while (true) {
    const char = text[j];
    // console.log(char);
    if (char === ',') {
      if (!length) {
        break;
      } else  {
        length--;
        // console.log('length --');
      }
    } else if (char === ':') {
      // console.log('length ++');
      
      length ++
    }
    j++;
  }

  if (text[i + 2] === '>' || text[i + 2] === '<') {
    console.log(text)
  }
  return [text.substring(0, i), stringToWorkflow(text.substring(i + 1, j)), stringToWorkflow(text.substring(j + 1))]
}

const transformData = (text: string): {
  workflows: {
    [ki: string]: Workflow;
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
    result.workflows[colList[0]] = stringToWorkflow(colList[1].replace('}', ''));
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

const part1CalcAccepted = (text: string) => {
  const workflowsData = transformData(text);
  const totalList = workflowsData.dataList
    .filter((data) => {
      let name = 'in';
      let workflow = workflowsData.workflows[name];
      while (name !== 'R' && name !== 'A') {
        if (Array.isArray(workflow)) {
          const ifText = workflow[0] as string;
          const ki = ifText[0] as string;
          
          const number = +ifText.substring(2);
          (ifText[1] === '>' ? data[ki] > number : data[ki] < number)
            ? (workflow = workflow[1])
            : (workflow = workflow[2]);
        } else {
          name = workflow;
          workflow = workflowsData.workflows[name];
        }
        
      }
      return name === 'A'
    });
  return totalList.reduce((total, data) => {
    return total + data.a + data.m + data.s + data.x;
  }, 0)
}

interface RangeData {
  x: number[];
  m: number[];
  a: number[];
  s: number[];
}
const part2CalcCombinations = (text: string) => {
  const workflowsData = transformData(text);
  
  const rangeDataList: RangeData[] = [];

  const findList: {
    workflow: Workflow;
    range: RangeData;
  }[] = [
    {
      workflow: workflowsData.workflows['in'],
      range: {
        x: [1, 4000],
        m: [1, 4000],
        a: [1, 4000],
        s: [1, 4000],
      }
    }
  ]
  while (findList.length) {
    const rangeData = findList.shift();
    const workflow = rangeData.workflow;
    // let workflow = workflowsData.workflows[rangeData.workflow];
    console.log(workflow);
  
    if (!workflow) {
      continue
    }
    if (Array.isArray(workflow)) {
      const ifText = workflow[0] as string;
      const ki = ifText[0] as string;
      const number = +ifText.substring(2);
      if (ifText[1] === '>') {
        rangeData.range[ki][0] = Math.max(rangeData.range[ki][0], number + 1);
      } else {
        rangeData.range[ki][1] = Math.min(rangeData.range[ki][1], number - 1);
      }
      findList.push(
        {
          workflow: workflow[1],
          range: JSON.parse(JSON.stringify(rangeData.range))
        },
        {
          workflow: workflow[2],
          range: JSON.parse(JSON.stringify(rangeData.range))
        }
      )
    } else if (workflow !== 'A' && workflow !== 'R') {
      findList.push(
        {
          workflow: workflowsData.workflows[workflow],
          range: JSON.parse(JSON.stringify(rangeData.range))
        }
      )
    } else if (workflow === 'A') {
      rangeDataList.push(rangeData.range);
    }
  }
  console.log(rangeDataList);
  
}

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
// 's<164:a>1424:bp,a,a>1424:bp,a>799:nfc,qvg'
// console.log(stringToWorkflow('s<164:a>1424:bp,a,a>1424:bp,a>799:nfc,qvg'));
// console.log(part1CalcAccepted(data));
console.log(part2CalcCombinations(a));
// 532551


// {x=787,m=2655,a=1222,s=2876}: in-> qqz-> qs-> lnx->A
// {x=1679,m=44,a=2067,s=496}: in-> px-> rfg-> gd->R
// {x=2036,m=264,a=79,s=2244}: in-> qqz-> hdj-> pv->A
// {x=2461,m=1339,a=466,s=291}: in-> px-> qkq-> crn->R
// {x=2127,m=1623,a=2188,s=1013}: in-> px-> rfg->A

