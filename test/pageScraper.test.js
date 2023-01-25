const scraperObject = require('../pageScraper');


describe('Amazon', () => {
    beforeAll(async () => {
      await scraperObject.goto('https://Amazon.com');
    });
  
    it('should be titled "Amazon"', async () => {
      await expect(page.title()).resolves.toMatch('Amazon');
    });
  });
