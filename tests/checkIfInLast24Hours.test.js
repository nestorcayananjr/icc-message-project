const checkIfInLast24Hours = require('../utils/checkIfInLast24Hours');

describe('checkIfInLast24Hours', () => {

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns true if the message was stored less than 24 hours ago', () => {
    const twelveHoursAgo = new Date('2024-01-01T10:00:00Z');
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

    expect(checkIfInLast24Hours(twelveHoursAgo)).toBe(true);
  });

  it('returns false if the message was stored more than 24 hours ago', () => {
    const twentyFiveHoursAgo = new Date('2024-01-01T10:00:00Z');
    twentyFiveHoursAgo.setHours(twentyFiveHoursAgo.getHours() - 25);

    expect(checkIfInLast24Hours(twentyFiveHoursAgo)).toBe(false);
  });

  it('returns true if the message was stored exactly at 24 hours', () => {
    const exactlyTwentyFourHoursAgo = new Date('2024-01-01T10:00:00Z');
    exactlyTwentyFourHoursAgo.setHours(exactlyTwentyFourHoursAgo.getHours() - 24);

    expect(checkIfInLast24Hours(exactlyTwentyFourHoursAgo)).toBe(false);
  });

});