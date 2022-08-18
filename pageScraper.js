const scraperObject = {
  url: "https://www.amazon.com/s?k=raspberry+pi+4&crid=1PS9ECP3EE5TL&sprefix=raspberry+pi+4%2Caps%2C139&ref=nb_sb_noss_1",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);

    const whole_price = await page.evaluate(() =>
      Array.from(document.querySelectorAll("span.a-price-whole")).map(
        (wholePrice => wholePrice.innerText.replace('\n.',''))
      )
    );

    const fraction_price = await page.evaluate(() =>
      Array.from(document.querySelectorAll("span.a-price-fraction")).map(
        (fractionPrice => fractionPrice.innerText)
      )
    );

    const price = whole_price.map((left, idx) => [left.concat('.',fraction_price[idx])]);
    const merged_prices = [].concat.apply([], price);
    
    console.log(merged_prices)

    await browser.close();
  },
};

module.exports = scraperObject;
