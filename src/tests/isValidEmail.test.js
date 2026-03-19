const isValidEmail = require("../utils/isValidEmail")

describe('isValidEmail', () => {
    it('returns truthy for valid email address', () => {
        const validEmailAddress = "jdavis@icc.com"

        expect(isValidEmail(validEmailAddress)).toBe(true);
    });

    it('returns falsey for invalid email address', () => {
        const normalString = "abcd";
        const emptyString = ""
        const noCharsBeforeSymbol = "@gmail.com";
        const noCharsAfterSymbol = "abcd@"
        const noDotSymbol = "abc@gmailcom"

        expect(isValidEmail(normalString)).toBe(false);
        expect(isValidEmail(noCharsBeforeSymbol)).toBe(false);
        expect(isValidEmail(emptyString)).toBe(false);
        expect(isValidEmail(noCharsAfterSymbol)).toBe(false);
        expect(isValidEmail(noDotSymbol)).toBe(false);
    })
})