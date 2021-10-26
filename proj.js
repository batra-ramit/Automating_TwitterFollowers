// node proj.js --config=config1.json

// npm init -y
// npm install minimist
// npm install axios
// npm install jsdom
// npm install excel4node
// npm install puppeteer
// npm i puppeteer-autoscroll-down

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

  await page.goto(configJSO.emailurl);

  await page.waitForSelector("span#email_ch_text");

  await page.waitFor(5000);
  console.log("waited");
  let tempmail = await page.$eval("span#email_ch_text", function (intag) {
    console.log("here");
    return intag.textContent;
  });
  console.log(tempmail);

  let npage = await browser.newPage();
  await npage.goto(configJSO.url);

  // await npage.waitForSelector("div[aria-label='Follow @sachin_rt']");
  // await npage.click("div[aria-label='Follow @sachin_rt']");

  // await npage.waitForSelector("a[href='/login']");
  // await npage.click("a[href='/login']");

  await npage.waitForSelector("a[href='/i/flow/signup']");
  await npage.click("a[href='/i/flow/signup']");

  await npage.waitFor(5000);
  await npage.waitForSelector("input[name='name']");
  await npage.type("input[name='name']", configJSO.name);

  await npage.waitForSelector("div[role='button' ]> span");
  await npage.click("div[role='button'] > span");

  await npage.waitFor(5000);
  await npage.waitForSelector("input[name='email']");
  await npage.keyboard.press("Tab");
  await npage.type("input[name='email']", tempmail);
    
  await npage.keyboard.press('Tab');
  await npage.keyboard.press('Tab');
  await npage.keyboard.type('July');

  await npage.keyboard.press('Tab');
  await npage.keyboard.type('26');

  await npage.keyboard.press('Tab');
  await npage.keyboard.type('2001');
  await npage.waitFor(2000);

  await npage.keyboard.press('Tab');
  await npage.waitFor(2000);
  await npage.keyboard.press('Enter');

  await npage.waitFor(2000);

  await npage.keyboard.press('Tab');
  await npage.waitFor(500);
  await npage.keyboard.press('Tab');
  await npage.waitFor(500);
  await npage.keyboard.press('Tab');
  await npage.waitFor(500);
  await npage.keyboard.press('Tab');
  await npage.waitFor(500);
  await npage.keyboard.press('Enter');
    
  for (let i = 0; i < 9; i++) {
    await npage.waitFor(500);
    await npage.keyboard.press('Tab');
  }
  await npage.waitFor(500);
  await npage.keyboard.press('Enter');

  let mpage = await browser.newPage();
  await mpage.waitFor(10000);
  await mpage.goto(configJSO.emailurl + tempmail);

  await mpage.waitForSelector("td.h1.black");
  let otp = await mpage.$eval("td.h1.black", function (h1tag) {
    console.log("here");
    return h1tag.textContent;
  });
  await mpage.close();
      
  let fotp = otp.trim();
  console.log(fotp);
    

  await npage.waitFor(5000);
  await npage.keyboard.type(fotp);
  await npage.waitFor(500);
  await npage.keyboard.press('Tab');
  await npage.waitFor(500);
  await npage.keyboard.press('Tab');
  await npage.waitFor(500);
  await npage.keyboard.press('Enter');

  await npage.waitFor(5000);
  // await npage.keyboard.press('Tab');
  await npage.waitFor(1000);
  await npage.keyboard.type(configJSO.password, { delay: 500 });
  await npage.waitFor(1000);
  await npage.keyboard.press('Tab',);
  await npage.waitFor(1000);
  await npage.keyboard.press('Tab');
  await npage.waitFor(1000);
  await npage.keyboard.press('Enter');

  await npage.waitFor(1000);
  // await npage.waitFor(500);
  // await npage.keyboard.press('Tab',);
  // await npage.waitFor(500);
  // await npage.keyboard.press('Tab');
  // await npage.waitFor(500);
  // await npage.keyboard.press('Enter');

  // await npage.waitFor(500);
  // await npage.keyboard.press('Tab');
  // await npage.waitFor(500);
  // await npage.keyboard.press('Enter');
    
  // await npage.waitFor(500);
  // await npage.keyboard.press('Tab',);
  // await npage.waitFor(500);
  // await npage.keyboard.press('Tab');
  // await npage.waitFor(500);
  // await npage.keyboard.press('Enter');
  await npage.waitFor(5000);
  await npage.close();

  let urlarr = configJSO.followurl;

  for (let i = 0; i < urlarr.length; i++) { 
  let fpage = await browser.newPage();
  await fpage.goto(urlarr[i]);
  await npage.waitFor(5000);
  await fpage.waitForSelector(".css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs");
  await npage.waitFor(5000);
  await fpage.click(".css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs");
  await npage.waitFor(5000);

  await fpage.close();
}
    await page.close();
  
}

