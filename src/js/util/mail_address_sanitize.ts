export function sunitizeAddress(mails: string[]): string[] {
  let result: string[] = [];

  mails.forEach(element => {
    if (element.indexOf('@') == -1) {
      return;
    }
    if (element.indexOf('<') == -1) {
      result.push(element);
      return;
    }

    let resultStr;
    let splitAdd = element.split('<');
    if (splitAdd[1].indexOf('>') > 0) {
      splitAdd = splitAdd[1].split('>');
      resultStr = splitAdd[0].trim();
    } else {
      resultStr = splitAdd[1].trim();
    }
    result.push(resultStr);
  });
  return result;
}
