export class ReturnMessage {
  erroLevel: string;
  errorCode: string;
  title: string;
  detailMessage?: string;

  constructor(erroLevel: string, errorCode: string, title: string, detailMessage?: string) {
    this.erroLevel = erroLevel;
    this.errorCode = errorCode;
    this.title = title;
    this.detailMessage = detailMessage;
  }
}

export function createReturnMsg(elevel: string, ecode: string, etitle: string, edetails?: string): ReturnMessage {
  return new ReturnMessage(elevel, ecode, etitle, edetails);
}
