const fs = require('fs')
const scraperObject = {
  url: "https://www.amazon.com/s?k=raspberry+pi+4&i=computers&rh=p_36%3A3500-&crid=2KVTRB9PAEY56&qid=1661408932&rnid=386442011&sprefix=raspberry+pi+4+%2Ccomputers%2C155&ref=sr_nr_p_36_5",
  async scraper(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);
    await page.goto(this.url);

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

    const products = await page.evaluate(() =>
      Array.from(document.querySelectorAll("span.a-size-medium.a-color-base.a-text-normal")).map(
        (products) => products.innerText.replace("\n.", "")
      )
    );

    const price = whole_price.map((left, idx) => [
      left.concat(".", fraction_price[idx]),
    ]);

    const merged_prices = [].concat.apply([], price);
    const date = new Date(); 
    const pies = merged_prices.map((o, i) => ({Price: '$' + o , product: products[i]}));
    const json_data = {'Date': date, 'Pies': pies};
    
    console.log(merged_prices);

    fs.writeFile(
      "./pie_price.json",
      JSON.stringify(json_data, null, 3),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Saved to JSON file");
      }
    );

    await browser.close();
  },
};

module.exports = scraperObject;
