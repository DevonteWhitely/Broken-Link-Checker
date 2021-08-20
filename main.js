#!/usr/bin/env node

const { HtmlUrlChecker } = require("broken-link-checker");
const { SiteChecker } = require("broken-link-checker");
const chalk = require('chalk');
const package = require("./package.json");
const fs = require('fs');

var counter = 0;
var badLinks = 0;
const dt = new Date();
const timestring = dt.toISOString();
const filename = `output-${timestring}.csv`;

const insertHeaders = function() {
    fs.appendFile(`./${filename}`, "Url, StatusCode, Internal?\n", (err) => {
    if (err) throw err;
    });
}

const htmlUrlChecker = new HtmlUrlChecker(
    {
        excludeInternalLinks: false,
        excludeExternalLinks: false,
        filterLevel: 0,
        acceptedSchemes: ["http", "https"],
        excludedKeywords: [],
        excludeLinksToSamePage: true,
        cacheResponses: true
    },
    {
        "error": (error) => {
            console.log(error);
        },
        "end": () => {
            console.log(chalk.green("\nSCAN COMPLETE"));
            console.log(`Links scanned: ${chalk.yellow(counter)}`);
            console.log(`Bad links: ${chalk.red(badLinks)}`);
        },
        "link": (result) => {
            if (result.broken) {
                console.log(`\nLink: ${chalk.red(result.url.resolved)}`);
                console.log(`Status Code: ${chalk.yellow(result.http.response.statusCode)}`);
                console.log(`Internal/External: ${result.internal ? internal = chalk.yellow("Internal") : internal = chalk.yellow("External")}`);
                counter++;
                badLinks++;
                var object = {'url': result.url.resolved, 'statusCode': result.http.response.statusCode, 'internal': result.internal, 'text': result.html.text};

                var csvEscape = function(data) {
                    return data.replace(/"/g, '\\"');
                }

                var obj_str = `${csvEscape(result.url.resolved)},${csvEscape(result.http.response.statusCode.toString())},${csvEscape(result.internal.toString())}\n`;

                fs.appendFile(`./${filename}`, `${obj_str}`, (err) => {
                    if (err) throw err;
                  });                
            } else {
                console.log(`\nLink: ${chalk.green(result.url.resolved)}`);
                console.log(`Status Code: ${chalk.yellow(result.http.response.statusCode)}`);
                console.log(`Internal/External: ${result.internal ? internal = chalk.yellow("Internal") : internal = chalk.yellow("External")}`);
                counter++;
            }
        }
    }
);

const siteChecker = new SiteChecker(
    {
        excludeInternalLinks: false,
        excludeExternalLinks: false,
        filterLevel: 0,
        acceptedSchemes: ["https"],
        excludedKeywords: ["localhost", "host", "null"],
        excludeLinksToSamePage: true,
        cacheResponses: true
    },
    {
        "error": (error) => {
            console.log(error);
        },
        "end": () => {
            console.log(chalk.green("\nSCAN COMPLETE"));
            console.log(`Links scanned: ${chalk.yellow(counter)}`);
            console.log(`Bad links: ${chalk.red(badLinks)}`)
        },
        "link": (result) => {
            if (result.broken) {
                console.log(`\nLink: ${chalk.red(result.url.resolved)}`);
                console.log(`Internal/External: ${result.internal ? internal = chalk.yellow("Internal") : internal = chalk.yellow("External")}`);
                counter++;
                badLinks++;

                var object = {'url': result.url.resolved, 'statusCode': result.http.response.statusCode, 'internal': result.internal, 'text': result.html.text};

                var csvEscape = function(data) {
                    return data.replace(/"/g, '\\"');
                }

                var obj_str = `${csvEscape(result.url.resolved)},${csvEscape(result.http.response.statusCode.toString())},${csvEscape(result.internal.toString())}\n`;

                fs.appendFile(`./${filename}`, `${obj_str}`, (err) => {
                    if (err) throw err;
                  });
            } else {
            console.log(`\nLink: ${chalk.green(result.url.resolved)}`);
            console.log(`Status Code: ${chalk.yellow(result.http.response.statusCode)}`);
            console.log(`Internal/External: ${result.internal ? internal = chalk.yellow("Internal") : internal = chalk.yellow("External")}`);
            counter++;                  
            }
        }
    }
);

//====================================================================================================================================================================================================

var myArgs = process.argv.slice(2);

switch (myArgs[0]) {
    case '--github':
        insertHeaders();
        console.log("\nScanning Kinetica's Github Repositories: " + chalk.grey("https://github.com/orgs/kineticadb/repositories") + " ...\n");
        siteChecker.enqueue('https://github.com/orgs/kineticadb/repositories');
        break;
    case '--docsite':
        insertHeaders();
        console.log("\nScanning Kinetica's Doc Site: " + chalk.grey("https://docs.kinetica.com/7.1/") + " ...\n");
        siteChecker.enqueue('https://docs.kinetica.com/7.1/');
        break;        
    case '--corporate':
        insertHeaders();
        console.log("\nScanning Kinetica's Corporate Site: " + chalk.grey("https://www.kinetica.com/") + " ...\n");
        siteChecker.enqueue('https://www.kinetica.com/');
        break;
    case '--single':
        insertHeaders();
        console.log(chalk.green("\nSingle page scan enabled"));
        break;
    case '-s':
        insertHeaders();
        console.log(chalk.green("\nSingle page scan enabled"));
        break;
    case '--multi':
        insertHeaders();
        console.log(chalk.green("\nMulti page scan mode enabled"));
        break;
    case '-m':
        insertHeaders();
        console.log(chalk.green("\nMulti page scan mode enabled"));
        break;
    case '--help':
        console.log(`\nBroken Link Checker: Checks for problematic internal/external links within Kinetica's doc site, corporate site, and github repositories. (v${package.version})\n`);
        console.log("Usage:");
        console.log(`${chalk.red("blc")} ${chalk.green("[OPTIONS]")} ${chalk.magenta("[ARGS]")}\n`);

        console.log('Options:')
        console.log(`--${chalk.green("single")}, -${chalk.green("s")}  Enables single-page scan mode.`);
        console.log(`--${chalk.green("multi")}, -${chalk.green("m")}   Enables multi-page/sitewide scan mode.\n`);

        console.log("Arguments:")
        console.log(`--${chalk.magenta("docsite")}     Scans Kinetica's docsite.`);
        console.log(`--${chalk.magenta("corporate")}   Scans Kinetica's corporate site.`);
        console.log(`--${chalk.magenta("github")}      Scans Kinetica's github repositories.\n`);
        break;
    case '-h':
        console.log(`\nBroken Link Checker: Checks for problematic internal/external links within Kinetica's doc site, corporate site, and github repositories. (v${package.version})\n`);
        console.log("Usage:");
        console.log(`${chalk.red("blc")} ${chalk.green("[OPTIONS]")} ${chalk.magenta("[ARGS]")}\n`);

        console.log('Options:')
        console.log(`--${chalk.green("single")}, -${chalk.green("s")}  Enables single-page scan mode.`);
        console.log(`--${chalk.green("multi")}, -${chalk.green("m")}   Enables multi-page/sitewide scan mode.\n`);

        console.log("Arguments:")
        console.log(`--${chalk.magenta("docsite")}     Scans Kinetica's docsite.`);
        console.log(`--${chalk.magenta("corporate")}   Scans Kinetica's corporate site.`);
        console.log(`--${chalk.magenta("github")}      Scans Kinetica's github repositories.\n`);
        break;
    default:
        insertHeaders();
        console.log(chalk.yellow("\nNo mode selected, multi page scan by default.\n"));
        siteChecker.enqueue(myArgs[0]);
    }

if (myArgs[0] == '--single' || myArgs[0] == '-s') {
    if (myArgs[1] == '--github') {
        htmlUrlChecker.enqueue('https://github.com/orgs/kineticadb/repositories');
    } else if (myArgs[1] == '--docsite') {
        htmlUrlChecker.enqueue('https://docs.kinetica.com/7.1/');
    } else if (myArgs[1] == '--corporate') {
        htmlUrlChecker.enqueue('https://www.kinetica.com/');
    } else {
       htmlUrlChecker.enqueue(myArgs[1]); 
    }
} else if (myArgs[0] == '--multi' || myArgs[0] == '-m') {
    if (myArgs[1] == '--github') {
        siteChecker.enqueue('https://github.com/orgs/kineticadb/repositories');
    } else if (myArgs[1] == '--docsite') {
        siteChecker.enqueue('https://docs.kinetica.com/7.1/');
    } else if (myArgs[1] == '--corporate') {
        siteChecker.enqueue('https://www.kinetica.com/');
    } else {
       siteChecker.enqueue(myArgs[1]); 
    }
}
