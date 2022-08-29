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
const Pies = data.Pies;
const Date = data.Date;
const pieDiv = document.getElementById("Pie");
const dateDiv = document.getElementById("Date");
const Header = document.createElement("h3");
Header.innerHTML = Date;
dateDiv.appendChild(Header);
const pieLength = Pies.length;
for (let i = 0; i < pieLength; i++) {
  const listPies = document.createElement("ul");
  listPies.innerHTML = (Pies[i]["Price"] + ", " +Pies[i]["Product"]);     
  pieDiv.appendChild(listPies)
}
}