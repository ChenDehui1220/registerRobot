const webdriverio = require('webdriverio');
const chromedriver = require('chromedriver');
const csv = require('csv-streamify');
const fs = require('fs');
const csvFileName = 'employee.csv';
const screenFolder = './screenshot/';
const targetUrl = 'https://member.friday.tw/fri/sso/web/signup';
const port = 9515;

// Read CSV
const parser = csv({
    objectMode: true,
    newline: '\r'
}, function (err, result) {
    if (err) throw err
    result.forEach(function (line) {
        var employeeNumber = line[0];
        var employeeName = line[1];
        var employeePhone = line[2];

        startRegi(employeePhone);
    })
})

fs.createReadStream(csvFileName).pipe(parser)

chromedriver.start([
    '--url-base=wd/hub',
    `--port=${port}`,
    '--verbose'
]);

const opts = {
    port: port,
    desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--headless']
        }
    }
};

//YSDT 註冊
function startRegi(ePhone) {
    (async() => {
        var passWordStr = 'YsDt' + ePhone.substr(-4);
        var browser = webdriverio.remote(opts).init();
console.log('pwd is ' + passWordStr);
        await browser.url(targetUrl);
        await browser.setValue('input[id="account"]', ePhone);
        await browser.setValue('input[id="password"]', passWordStr);
        await browser.setValue('input[id="re-password"]', passWordStr);

        await browser.click('#agree');
        await browser.click('.hiiir-btn');
        await browser.pause(500);

        const buffer = await browser.saveScreenshot(screenFolder + ePhone + '.png');
        console.log('Saved ' + ePhone + ' screenshot...');

        browser.end();
    })();
}

// chromedriver.stop();