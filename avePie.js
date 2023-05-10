const https = require("https");
const fs = require("fs");

const url = "https://www.cjvillarreal.com/amazon-pie-scrapper/pie_price.json";

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const pieData = JSON.parse(data);
      const products = pieData.AMZ.concat(pieData.CANAKIT);
      const averagePrice =
        products.reduce((acc, { Price }) => acc + parseFloat(Price.slice(1)), 0) / products.length;
      const currentDate = new Date().toISOString();

      const jsonData = {
        Date: currentDate,
        AveragePrice: averagePrice.toFixed(2),
      };

      const filePath = "./avePie.json";
      if (fs.existsSync(filePath)) {
        const existingData = JSON.parse(fs.readFileSync(filePath));
        const newData = [jsonData, ...existingData];
        fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
      } else {
        fs.writeFileSync(filePath, JSON.stringify([jsonData], null, 2));
      }

      console.log("Average price:", jsonData.AveragePrice, "as of", jsonData.Date);
    } catch (error) {
      console.error(error.message);
    }
  });
}).on("error", (error) => {
  console.error(error.message);
});
