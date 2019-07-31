const fs = require("fs")
const path = require("path")
const storagePath = path.join(__dirname, "..", "..", "./storage/token.txt")
const loadPath = path.join(__dirname, "..", "..", "./index.html")
// const storagePath = "./storage/token.txt"

$(document).ready(function() {
  var $doc = $(document)
  var click = () => {
    fs.writeFile(storagePath, '', function(err) {
      if (err) {
        throw err
      } else {
        console.log('token deleted')
      }
    })
    $("#content").load(loadPath, function() {
      console.log("load was performed")
    })
  }

  $doc.on("click", ".logout-button", click)
})
