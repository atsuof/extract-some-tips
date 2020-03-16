import {hiddenSheetCheck} from '../../../../src/js/check_logic/xlsx/xlsx'
import fs from 'fs';
import { AttachedFilename } from '../../../../src/js/check_logic/yonobi/types/yonobi_types';
import { ReturnMessage } from '../../../../src/js/check_logic/util/msg_util';

describe("xlsx.ts", () => {
  test('hiddenSheetCheck', () => {
    let readfile = fs.readFileSync(__dirname + '/hiddensheet.xlsx','base64');
    let attachmentFile:AttachedFilename = {fileName:"hiddensheet.xls",fileData:readfile,mailTitle:""};
    expect(hiddenSheetCheck([attachmentFile])).toStrictEqual(
      new ReturnMessage("ERROR","010","添付ファイルに隠しシートが存在します.","  hiddensheet.xls,  ")
    );
  });
  test('usualSheetCheck', () => {
    var result = undefined;
    let readfile = fs.readFileSync(__dirname + '/usualsheet.xlsx','base64');
    let attachmentFile:AttachedFilename = {fileName:"usualsheet.xls",fileData:readfile,mailTitle:""};
    expect(hiddenSheetCheck([attachmentFile]) == undefined).toStrictEqual(
      true
    );
  });
  test('illegalExtensionCheck', () => {
    var result = undefined;
    let readfile = fs.readFileSync(__dirname + '/usualsheet.xlsx','base64');
    let attachmentFile:AttachedFilename = {fileName:"usualsheetxls",fileData:readfile,mailTitle:""};
    expect(hiddenSheetCheck([attachmentFile]) == undefined).toStrictEqual(
      true
    );
  });
  test('passwordBookCheck', () => {
    var result = undefined;
    let readfile = fs.readFileSync(__dirname + '/passwordBook.xlsx','base64');
    let attachmentFile:AttachedFilename = {fileName:"passwordBook.xls",fileData:readfile,mailTitle:""};
    expect(hiddenSheetCheck([attachmentFile]) == undefined).toStrictEqual(
      true
    );
  });
});