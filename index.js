const express = require("express");
const jsdom = require("jsdom");
const axios = require("axios");
const { JSDOM } = jsdom;
const dom = new JSDOM("html");
const app = express();
app.set("view engine", "ejs");

const URL =
  "https://www.amazon.in/s?k=iphone&crid=15QVU7R2QDSEG&sprefix=iphon%2Caps%2C298&ref=nb_sb_noss_2";
async function fetchData() {
  try {
    const response = await axios.get(URL, {
      method: "GET",
      headers: {
        Host: "www.amazon.in",
        "Upgrade-Insecure-Requests": 1,
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      },
    });
    const { document } = new JSDOM(response.data).window;
    const products = [];

    const cardContainers = document.querySelectorAll(".s-card-container");

    cardContainers.forEach((element) => {
      const imageElement = element.querySelector(".s-image");
      const titleElement = element.querySelector("h2 span");
      const priceElement = element.querySelector(".a-price-whole");

      if (imageElement && titleElement && priceElement) {
        const product = {
          image: imageElement.src,
          title: titleElement.textContent,
          price: priceElement.textContent,
        };

        products.push(product);
      }
    });
    return products;

    console.log(products);
  } catch (error) {
    console.log(error, "==error");
  }
}

app.get("/", async function (req, res) {
  const products = await fetchData();
  res.render("pages/index.ejs", { products });
});

app.listen(3000, () => console.log("Server Started"));
