import { validateCardNumber, getPaymentSystem } from '../index';

describe('validateCardNumber', () => {
    const testCases = [
        { name: 'Visa (16 цифр, начинается с 4)', input: '4111111111111111', expected: true },
        { name: 'MasterCard (16 цифр, начинается с 5)', input: '5555555555554444', expected: true },
        { name: 'МИР (16 цифр, начинается с 2)', input: '2201382000000013', expected: true },
        { name: 'American Express (15 цифр, начинается с 34)', input: '341234567890123', expected: false },
        { name: 'American Express (15 цифр, начинается с 37)', input: '371234567890123', expected: false },
        { name: 'номер с пробелами', input: '4111 1111 1111 1111', expected: true },
        { name: 'непроходящий алгоритм Луна', input: '1234567890123456', expected: false },
        { name: 'слишком короткий номер', input: '1234', expected: false },
        { name: 'пустая строка', input: '', expected: false }
    ];

    testCases.forEach(({ name, input, expected }) => {
        test(name, () => {
            expect(validateCardNumber(input)).toBe(expected);
        });
    });
});

describe('getPaymentSystem', () => {
    const testCases = [
        { name: 'Visa (начинается с 4)', input: '4111111111111111', expected: 'visa' },
        { name: 'MasterCard (начинается с 5)', input: '5555555555554444', expected: 'mastercard' },
        { name: 'МИР (начинается с 2)', input: '2201382000000013', expected: 'mir' },
        { name: 'American Express (начинается с 34)', input: '341234567890123', expected: 'amex' },
        { name: 'American Express (начинается с 37)', input: '371234567890123', expected: 'amex' },
        { name: 'Discover (начинается с 6011)', input: '6011111111111117', expected: 'discover' },
        { name: 'JCB (начинается с 35)', input: '3530111333300000', expected: 'jcb' },
        { name: 'неизвестная система', input: '9999999999999999', expected: 'unknown' },
        { name: 'пустая строка', input: '', expected: 'unknown' }
    ];

    testCases.forEach(({ name, input, expected }) => {
        test(name, () => {
            expect(getPaymentSystem(input)).toBe(expected);
        });
    });
});