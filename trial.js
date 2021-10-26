let minimist = require("minimist");
let puppeteer = require("puppeteer");
let fs = require("fs");
let scroll = require("puppeteer-autoscroll-down");
let excel4node = require("excel4node");
let axios = require("axios");
let jsdom = require("jsdom");

let args = minimist(process.argv);

let configJSON = fs.readFileSync(args.config, "utf-8");
let configJSO = JSON.parse(configJSON);
console.log(configJSO);


run();


async function run() {
  
    let browser = await puppeteer.launch({
        defaultViewport: null,

        args: ["--start-maximized"],
        headless: false,
    });

    let pages = await browser.pages();
    let page = pages[0];

    await page.goto("https://twitter.com/sachin_rt");

    await page.waitFor(5000);
  await page.waitForSelector(".css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs");
  await page.waitFor(5000);
  await page.click(".css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs");
  await page.waitFor(5000);
}