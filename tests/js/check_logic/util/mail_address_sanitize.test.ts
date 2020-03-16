import { sunitizeAddress } from '../../../../src/js/check_logic/util/mail_address_sanitize';

describe('mail_address_sanitize.ts', () => {
  test('sunitizeAddress usual address', () => {
    let emails: Array<string> = ['aaa@test.co.jp', 'テスト太郎<test_taro@test.co.jp>'];
    expect(sunitizeAddress(emails)).toStrictEqual(['aaa@test.co.jp', 'test_taro@test.co.jp']);
  });
  test('sunitizeAddress illegal address', () => {
    let emails: Array<string> = [
      'aaa@test.co.jp',
      'テスト太郎<test_taro@test.co.jp',
      'テスト太郎<test_tarotest.co.jp',
      'テスト太郎test_taro@test.co.jp>',
    ];
    expect(sunitizeAddress(emails)).toStrictEqual(['aaa@test.co.jp', 'test_taro@test.co.jp', 'テスト太郎test_taro@test.co.jp>']);
  });
});
