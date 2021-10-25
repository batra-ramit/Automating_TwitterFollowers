// node LinkedInLike.js --url="https://in.linkedin.com/" --output=Jobs.csv --dest=Jobs.json --userid="ramitbatra.official@gmail.com" --password="ramitbatra2607"

// working till line 50

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

Run();

async function Run() {
    let browser = await puppeteer.launch({
        defaultViewport: null,
        args: ["--start-maximized"],
        headless: false,
    });

    let pages = await browser.pages();
    let page = pages[0];

    await page.goto(args.url);
    
 
    await page.waitForSelector("input[autocomplete='username']");
    await page.type("input[autocomplete='username']", args.userid);

    await page.waitForSelector("input[autocomplete='current-password']");
    await page.type("input[autocomplete='current-password']", args.password);

    await page.waitForSelector(
        "button[data-tracking-control-name='homepage-basic_signin-form_submit-button']"
    );
    await page.click(
        "button[data-tracking-control-name='homepage-basic_signin-form_submit-button']"
    );

    await page.waitForSelector("section.msg-overlay-bubble-header__details.flex-row.align-items-center.ml1");
    await page.click("section.msg-overlay-bubble-header__details.flex-row.align-items-center.ml1");

    
        window.scrollBy(0, window.innerHeight);
  
    await page.waitForSelector("span.reactions-react-button.feed-shared-social-action-bar__action-button.feed-shared-social-action-bar__action-button--expand");
    await page.click("span.reactions-react-button.feed-shared-social-action-bar__action-button.feed-shared-social-action-bar__action-button--expand");
      
   

}

async function autoScroll(page){
    
    await page.evaluate(async () => {
        
          await new Promise((resolve, reject) => {
              var totalHeight = 0;
              var distance = 100;
              var timer =  setInterval(() => {
                  var scrollHeight = document.body.scrollHeight;
                  window.scrollBy(0, distance);
                  totalHeight += distance;
                  
                
                  if (totalHeight >= scrollHeight) {
                      clearInterval(timer);
                      resolve();
                  }

              }, 1000);
              
          });
      });
    
}
