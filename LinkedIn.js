// node LinkedIn.js --url="https://in.linkedin.com/" --output=Jobs.csv --dest=Jobs.json --userid="ramitbatra.official@gmail.com" --password="ramitbatra2607"

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

    await page.waitForSelector("use[href='#global-nav-icon--mercado__jobs']");
    await page.click("use[href='#global-nav-icon--mercado__jobs']");

    await page.waitForSelector(
        "input[ aria-label='Search by title, skill, or company']"
    );
    await page.type(
        "input[ aria-label='Search by title, skill, or company']",
        "javascript"
    );

    await page.waitForSelector("button.jobs-search-box__submit-button");
    await page.click("button.jobs-search-box__submit-button");

    //   await page.waitForSelector("a.job-card-container__link.job-card-list__title");

    console.log("waited");

    await page.waitForSelector("section.msg-overlay-bubble-header__details.flex-row.align-items-center.ml1");
    await page.click("section.msg-overlay-bubble-header__details.flex-row.align-items-center.ml1");
  
    //   await page.waitForSelector("button[aria-label='Page 1']");
    //   await page.click("button[aria-label='Page 1']",);
    
    await page.waitForSelector("a.job-card-container__link.job-card-list__title");
    
    //  await autoScroll(page);
    // const lastPosition = await scroll.scrollPageToBottom(page);
    
    
    // await page.waitFor(3000);
    // const selector = "button[aria-label='Page 1']";

    // scroll selector into view
    // await page.evaluate(selector => {
    //     const element = document.querySelector(selector);
    //     if (element) {
    //         element.scrollTop = element.offsetHeight;
    //         console.error(`Scrolled to selector ${selector}`);
    //     } else {
    //         console.error(`cannot find selector ${selector}`);
    //     }
    // }, selector);
   
    await autoScroll(page);

    let joburls = await page.$$eval("a.job-card-container__link.job-card-list__title",
        function (atags) {
            let urls = [];
        
            for (let i = 0; i < atags.length; i++) {
                let url = atags[i].getAttribute("href");
                urls.push(url);
            }
        
            return urls;
        }
    );
    let wb = new excel4node.Workbook();
    let sheet = wb.addWorksheet();
    sheet.cell(1, 1).string("Name");
    sheet.cell(1, 2).string("Self Score");
    sheet.cell(1, 3).string("Opp Score");
    sheet.cell(1, 4).string("Result");


    for (let i = 0; i < joburls.length; i++) {
        let url = args.url + joburls[i];
        let npage = await browser.newPage();
        await npage.goto(url);
        await npage.waitForSelector("h1.t-24");
        let axiosresponse = axios.get(url);
            
           axiosresponse.then( function (response) {

                // console.log(response);
                let html = response.data;
                fs.writeFileSync("res.html", html, "utf-8");
      
            let dom = new jsdom.JSDOM(html);
      
               let document = dom.window.document;
               
           
            // let name = document.querySelectorAll(" div.p5 > h1.t-24");
            // let name = document.querySelectorAll("h1.t-24");
                   let name = document.getElementsByClassName('h1.top-card-layout__title.topcard__title');
                console.log(name);
                let val = name.textContent;
                console.log(val);
                sheet.cell(i + 2, 1).string(val);
                
                   
               
          
            
        });

        await npage.waitFor(2000);
        await npage.close();
  
    }
    wb.write(args.output);

}



async function autoScroll(page){
  try {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
  } catch (error) {
      console.log(error);
  }
}

