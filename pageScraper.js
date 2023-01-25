const fs = require('fs')
const scraperObject = {
  url: "https://www.amazon.com",
  async scraper(browser) {
    //const page = await browser.newPage();
    const page = (await browser.pages())[0]; //<-- use only one tab.
    console.log(`Navigating to ${this.url}...`);
    console.log((await browser.pages()).length);
    await page.goto(this.url);

    //await page.waitForSelector('');
    //type  in search bar
    await page.waitForSelector('#twotabsearchtextbox', {visible: true, timeout: 3000 });
    await page.type('#twotabsearchtextbox', 'Raspbery Pi');

    const whole_price = await page.evaluate(() =>
      Array.from(document.querySelectorAll("span.a-price-whole")).map(
        (wholePrice) => wholePrice.innerText.replace("\n.", "")
      )
    );

    const fraction_price = await page.evaluate(() =>
      Array.from(document.querySelectorAll("span.a-price-fraction")).map(
        (fractionPrice) => fractionPrice.innerText
      )
    );

    const price = whole_price.map((left, idx) => [
      left.concat(".", fraction_price[idx]),
    ]);
    const merged_prices = [].concat.apply([], price);
    const date = new Date();
    const json_data = {'Prices':merged_prices, 'date': date};

    console.log(json_data);
    // fs.writeFile(
    //   "./pie_price.json",
    //   JSON.stringify(json_data, null, 3),
    //   (err) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     console.log("Saved to JSON file");
    //   }
    // );

     await browser.close();
   },
 };

module.exports = scraperObject;
