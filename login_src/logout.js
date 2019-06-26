const fs = require("fs")
const storagePath = __dirname + "/storage/token.txt"

$(document).ready(function(){
  $("#content").on("click", ".logout-button", function() {
    // delete the token from the storage file
    fs.writeFile(storagePath, '', function() {
      console.log('token deleted')
    })
    $("#content").load("./index.html", function() {
      console.log("load was performed")
    })
  })
})
