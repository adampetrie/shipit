# ShipIt

### What is this?

ShipIt is a small node script that generates Confluence pages to show you the state of repository at a given time. It connects to GitHub, TestRail and Confluence in order to perform it's magic.

### How does it work?

Clone this repo and then:
```
cd shipit
npm install
npm install -g
```
Then just `shipit` with the following:

```
  Usage: shipit [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -r, --repo <required>  Repository
    -b, --base <required>  The base for comparison
    -h, --head <required>  The head for comparison
```

So for example:

`shipit -r flyers -b master -h dev`

Would create a confluence page showing the Jira tickets that have commits on the `flyers/dev` that are not on `flyers/master`. The script will also add commits that do not have ticket references on them so you can see exactly what would get merged based on the current comparison.

### Connecting to 3rd Parties

Shipit uses a `.env` file to pull in credentials for GitHub, TestRail and Confluence. After you clone this repo you will need to create a `.env` file with the following entries:

```
GITHUB_USER=myghuser
GITHUB_PASSWORD=myghpassword

CONFLUENCE_USER=myconfuser
CONFLUENCE_PASSWORD=myconfpassword

TESTRAIL_USER=mytruser
TESTRAIL_PASSWORD=mytrpassword
```

### Additional Configuration

Shipit supports configurations on a per repository basis. Take a look in `config.js` to see what the Flyers repo currently uses. The additional configuration allows you to specify the Confluence space to publish ShipIt pages to as well as a TestRail project ID that ShipIt will use to pull in the latest test run data.
