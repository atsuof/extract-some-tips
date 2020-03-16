import fs from 'fs';
import dayjs from 'dayjs';
import jszip from 'jszip';

class CpuAnalyzeInfo {
  time?: string;
  containerId?: string;
  name?: string;
  cpuUsage?: string;
  memUsage?: string;
  memLimit?: string;
  mempercent?: string;

  constructor(
    time?: string,
    containerId?: string,
    name?: string,
    cpuUsage?: string,
    memUsage?: string,
    memLimit?: string,
    mempercent?: string
  ) {
    this.time = time;
    this.containerId = containerId;
    this.name = name;
    this.cpuUsage = cpuUsage;
    this.memUsage = memUsage;
    this.memLimit = memLimit;
    this.mempercent = mempercent;
  }

  toString() {
    return this.time + ',' + this.name + ',' + this.cpuUsage + ',' + this.memUsage + ',' + this.memLimit + ',' + this.mempercent;
  }
}

const todayStr = dayjs(Date.now()).format('YYYYMMDD');
let ziptool = new jszip();

function readFile(dirName: string) {
  const fileNames = fs.readdirSync(dirName, 'utf8');
  let ziptargets = new Array<string>();
  fileNames.sort((a, b) => {
    if (a > b) {
      return 1;
    }
    return -1;
  });
  let resultArray = new Array<CpuAnalyzeInfo>();
  var writestr = '時間,システム名,CPU使用率,メモリ使用量,メモリ総量,メモリ使用率' + '\n';
  for (var fileNameIndex in fileNames) {
    const fileName = fileNames[fileNameIndex];
    const splitNames = fileName.split('metrics');
    if (fileName.includes('out') || fileName.includes('.zip') || splitNames.length != 2) {
      continue;
    }
    const fileTimeStamps = splitNames[1].split('.');
    if (fileTimeStamps[0] >= todayStr) {
      continue;
    }

    console.log('start radfile' + fileName);
    const contents = fs.readFileSync(dirName + '/' + fileName, 'utf8');
    ziptool.file(fileName, contents);
    ziptargets.push(dirName + '/' + fileName);
    const lines = contents.split('\n');
    let lineIndex = 1;
    let cpuAnalyzeInfo = null;
    let time: string = '';
    let continueflg = false;
    for (var index in lines) {
      let line = lines[index];
      if (!line) {
        continue;
      }
      if (lineIndex == 1) {
        if (continueflg && parseInt(index) % 8 != 0) {
          continue;
        }
        time = line.trim();

        const times = time.split(/\s+/);
        const date = times[0].replace(/\//g, '-');
        let tt = times[1];

        if (tt.split(':')[0].length == 1) {
          tt = '0' + tt;
        }
        tt = tt.split('.')[0] + '.0' + tt.split('.')[1];

        if (tt < '08:00:00.000' || tt > '22:00:00.000') {
          lineIndex = 1;
          continueflg = true;
          continue;
        } else {
          continueflg = false;
        }
        time = date + ' ' + tt;
        if (time.includes('12:01:23')) {
          console.log(time);
        }
      }
      if (lineIndex > 2) {
        cpuAnalyzeInfo = new CpuAnalyzeInfo();
        cpuAnalyzeInfo.time = time;
        const columns = line.split(/\s+/);
        if (columns.length > 7) {
          cpuAnalyzeInfo.containerId = columns[0];
          cpuAnalyzeInfo.name = columns[1];
          cpuAnalyzeInfo.cpuUsage = columns[2].replace('%', '');
          try {
            cpuAnalyzeInfo.memUsage = columns[3].replace('MiB', '');
          } catch (e) {
            console.log(e);
          }
          cpuAnalyzeInfo.memLimit = columns[5].replace('GiB', '');
          cpuAnalyzeInfo.mempercent = columns[6].replace('%', '');
          writestr += cpuAnalyzeInfo.toString() + '\n';
          resultArray.push(cpuAnalyzeInfo);
        }
      }

      if (lineIndex == 8) {
        lineIndex = 1;
      } else {
        lineIndex++;
      }
    }
  }
  console.log('end radfile');
  let isExists = fs.existsSync(dirName + '/out.txt');
  if (isExists) {
    fs.renameSync(dirName + '/out.txt', dirName + '/out.txt' + Date.now());
  }

  fs.writeFile(dirName + '/out' + todayStr + '.txt', writestr, { flag: 'wx' }, err => {
    if (err) {
      console.log(err);
    }
    console.log("It's saved!");
  });

  tozip(ziptargets, dirName);
}

async function tozip(ziptargets: Array<string>, dirName: string) {
  if (ziptargets.length == 0) {
    return;
  }

  ziptool
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(dirName + '/arch-metrics' + todayStr + '.zip'))
    .on('finish', function() {
      // JSZip generates a readable stream with a "end" event,
      // but is piped here in a writable stream which emits a "finish" event.
      console.log('out.zip written.');
    });

  for (var index in ziptargets) {
    fs.unlinkSync(ziptargets[index]);
  }
}
readFile('./src/js/tools/logs');
