import { createReturnMsg, ReturnMessage } from '../util/msg_util';
import xls from 'xlsx';
import { SheetProps } from 'xlsx';
import { AttachedFilename } from '../dto/types/dto_types';
interface Workbook {
  Sheets: SheetProps[];
}

type WorkBook = Workbook;

export function hiddenSheetCheck(fileDatas : [{fileName:string,fileData:string}]): ReturnMessage | undefined {

  let returnMsg: ReturnMessage | undefined;
  let xlschekresult = [];
  const xlsarray: Array<string> = ['xls', 'xlsx', 'xlw', 'xlsm'];
  for (var index in fileDatas) {
    var fileData: AttachedFilename = fileDatas[index];
    if (
      fileData.fileName.split('.').length < 2 ||
      xlsarray.includes(fileData.fileName.split('.')[fileData.fileName.split('.').length - 1].toLowerCase()) == false
    ) {
      continue;
    }
    try {
      var xlsxxx: Buffer = Buffer.from(fileData.fileData, 'base64');
      var workbook: xls.WorkBook = xls.read(xlsxxx);
      const ret = (workbook.Workbook as WorkBook).Sheets.some(sheet => {
        if (sheet.Hidden != 0) {
          return true;
        }
      });
      if (ret) {
        xlschekresult.push(fileData.fileName);
      }
    } catch (err) {
      console.error(err);
    }
  }
  if (xlschekresult.length != 0) {
    let detailMsg = '';
    xlschekresult.forEach(x => {
      detailMsg += '  ' + x + ',  ';
    });
    return createReturnMsg('ERROR', 'XXXX', 'somthing error exists', detailMsg);
  }
  return returnMsg;
}
