# Broken-Link-Checker #

* Checks for problematic internal/external links within webpages & websites.

### Features ###

* Supports single page scans as well as sitewide scans
* Allows users to scan any input url
* Contains features to scan Kinetica's docsite & corporate site
* All broken links are output to a local csv file for easy parsing & viewability

### Reporting ###

* Target URL (The broken link's target URL)
* Status Code (400, 401, 403, 404, etc.)
* Whether the broken link is internal or external pointing

### Command Line Usage ###

Check out the help option for available options:

`blc --help`
 or
`blc -h`

A typical site-wide check might look like:

`blc --single http://yoursite.com`
 or
`blc --multi --docsite`

### Future Considerations ###

* Ability to scan Kinetica's github repositories
