fetch("https://www.cjvillarreal.com/amazon-pie-scrapper/pie_price.json")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("NETWORK RESPONSE ERROR");
    }
  })
  .then((data) => {
    console.log(data);
    displayPrice(data);
  })
  .catch((error) => console.error("FETCH ERROR:", error));

function displayPrice(data) {
  const pies = data.AMZ.concat(data.CANAKIT);
  const date = new Date(data.Date);
  const pieDiv = document.getElementById("Pie");
  const dateDiv = document.getElementById("Date");
  const header = document.createElement("h3");
  header.innerHTML = date.toLocaleDateString();
  dateDiv.appendChild(header);
  const pieLength = pies.length;
  for (let i = 0; i < pieLength; i++) {
    const listPies = document.createElement("ul");
    listPies.innerHTML = `${pies[i].Price}, ${pies[i].Product}`;
    pieDiv.appendChild(listPies);
  }
}
