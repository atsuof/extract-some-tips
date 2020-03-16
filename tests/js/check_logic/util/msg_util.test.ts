import { ReturnMessage, createReturnMsg } from '../../../../src/js/check_logic/util/msg_util';

describe("msg_util.ts", () => {

  test('create msg', () => {
    expect(createReturnMsg('ERROR', '001', 'Title', 'TestString')).toStrictEqual(
      new ReturnMessage('ERROR', '001', 'Title', 'TestString')
    );
  });
});
