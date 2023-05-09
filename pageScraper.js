const fs = require("fs");

const scraperObject = {
  urls: [
    {
      url: "https://www.amazon.com/s?k=raspberry+pi+4&i=computers&rh=p_36%3A3500-&crid=2KVTRB9PAEY56&qid=1661408932&rnid=386442011&sprefix=raspberry+pi+4+%2Ccomputers%2C155&ref=sr_nr_p_36_5",
      productSelector: "span.a-size-medium.a-color-base.a-text-normal",
      priceWholeSelector: "span.a-price-whole",
      priceFractionSelector: "span.a-price-fraction",
      key: "AMZ",
    },
    {
      url: "https://www.canakit.com/raspberry-pi-4-complete-starter-kit.html",
      productSelector: "#MainContent_PricingDiv b",
      priceSelector2: "#MainContent_PricingDiv span.priceListPrice",
      priceFractionSelector: null,
      ProductAddToCart: "ProductAddToCartDiv",
      key: "CANAKIT",
    },
  ],
  async scraper(browser) {
    let json_data = { Date: new Date() };
    for (let i = 0; i < this.urls.length; i++) {
      let page = await browser.newPage();
      console.log(`Navigating to ${this.urls[i].url}...`);
      await page.goto(this.urls[i].url);

      const whole_price = await page.evaluate(
        (priceWholeSelector) =>
          Array.from(document.querySelectorAll(priceWholeSelector)).map(
            (wholePrice) => wholePrice.innerText.replace("\n.", "")
          ),
        this.urls[i].priceWholeSelector
      );

      let fraction_price = 0;
      if (this.urls[i].priceFractionSelector) {
        fraction_price = await page.evaluate(
          (selector) =>
            Array.from(document.querySelectorAll(selector)).map(
              (fractionPrice) => fractionPrice.innerText
            ),
          this.urls[i].priceFractionSelector
        );
      }

      let price2 = null;
      if (this.urls[i].priceSelector2) {
        price2 = await page.evaluate(
          (selector) =>
            Array.from(document.querySelectorAll(selector)).map((price) =>
              price.innerText.replace("\n.", "")
            ),
          this.urls[i].priceSelector2
        );
      }

      const products = await page.evaluate(
        (productSelector) =>
          Array.from(document.querySelectorAll(productSelector)).map(
            (products) => products.innerText.replace("\n.", "")
          ),
        this.urls[i].productSelector
      );

      const price = whole_price.map((left, idx) => {
        const priceFraction =
          fraction_price && fraction_price[idx]
            ? "." + fraction_price[idx]
            : "";
        return left.includes("$")
          ? left.concat(priceFraction)
          : "$" + left.concat(priceFraction);
      });

      let merged_prices = [].concat.apply([], price);
      if (price2) {
        merged_prices = merged_prices.concat(price2);
      }

      const ukey = this.urls[i].key;

      const data = merged_prices.map((o, i) => ({
        ID: `${ukey + [i]}`,
        Price: o,
        Product: products[i],
      }));

      json_data[this.urls[i].key] = data;

      await page.close();
    }

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
