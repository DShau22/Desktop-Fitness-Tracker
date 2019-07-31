// this script checks if the user has not completed setup yet
const {app, BrowserWindow, remote} = require('electron')
const path = require("path")
const storagePath = path.join(__dirname, "..", "..", "./storage/settings.json")
const setupHtmlPath = path.join(__dirname, "..", "..", "./setup.html")
const fs = require("fs")

function checkIfFirstTime() {
  fs.readFile(storagePath, 'utf8', function(err, data) {
    if (err) throw err
    var settings = JSON.parse(data)
    console.log("settings: ", settings)
    var { firstTimeUserDisplay } = settings
    // this is the first time that the user opened the application
    if (firstTimeUserDisplay) {
      $("#content").load(setupHtmlPath, function() {
        console.log("load was performed from: ", __dirname)
      })
    }
  })
}

module.exports = checkIfFirstTime
