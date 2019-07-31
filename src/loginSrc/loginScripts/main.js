const path = require("path")
const storagePath = path.join(__dirname, "..", "..", "./storage/token.txt")
const fs = require("fs")
const checkIfFirstTime = require("./firstTime")
// deletes the token given the path you pass
function deleteToken(path) {
  fs.writeFile(path, '', function() {
    console.log('token deleted')
  })
}

$(document).ready(function(){
  console.log("doc ready")
  // show loading screen before the login/spa
  toggleLoad()

  // check if this is the first time the user opened the application
  // if it is, then run setup
  checkIfFirstTime()

  // checks if the checkbox is checked or not after doc loads
  var isChecked = $("#check").prop("checked")
  $(document).on("click", "#check", function() {
    console.log("checked!")
    isChecked = $("#check").prop("checked")
  })

  // first check if user logged in before, and use token in storage
  // to verify
  var token = fs.readFileSync(storagePath).toString("utf-8")
  if (token.length > 0) {
    console.log("there is a token!", token.length)
    // veryify the token
    $.ajax({
      url: "http://localhost:8080/api/account/verify",
      type: "GET",
      headers: {"authorization": `Bearer ${token}`},
    })
      .done(function(data) {
        if (data.success) {
          // automatic login was successful, load spa
          $("#content").load("./spasIndex.html", function() {
            console.log("load was performed")
          })
        } else {
          // this means there's no token, or it expired
          deleteToken(storagePath)
        }
      })
  }
  toggleLoad()

  $("#content").on("click", "#signInButton", function() {
    console.log("sign in button clicked")
    // get the values of the form submission
    var email = $("div.sign-in-htm div.group #login-email").val()
    var password = $("div.sign-in-htm div.group #login-pass").val()
    var reqBody = {
      email,
      password,
      remember: isChecked,
    }

    // toggles all elements and shows the loading screen
    toggleLoad()

    $.ajax({
      url: 'http://localhost:8080/api/account/signin',
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(reqBody),
      dataType: 'json',
    })
      .done(function(data) {
        const { success, messages } = data
        if (success) {
          // save the token to a text file
          fs.writeFile(storagePath, data.token, (err) => {
            if (err) throw err
            console.log("success!")
            $("#content").load("./spasIndex.html", function() {
              console.log("load was performed")
            })
          })
        } else {
          showErrors(messages)
        }
      })
    // toggle back so Loading screen hides, elements show
    toggleLoad()
  })
}) //end of doc.ready

// display the loading screen and hide everything else
function toggleLoad(messages) {
  $("tab-1").toggle()
  $("tab-2").toggle()
  $(".tab").toggle()
  $(".login-form").toggle()
  $(".loading-screen").toggle()
}

//shows errors on invalid signup/in, takes in a messages object
function showErrors(messages) {
  $(".errors-container").show()
  var $errors = $(".errors-container").children("div.error")
  // get the messages in the message field
  var messageArr = Object.values(messages)
  messageArr.forEach(function(msg, idx) {
    $errors.eq(idx).show().children("span").text(msg)
  })
}

//shows success message on working signup
function showSuccess(messages) {
  $(".success-container").show()
  var $errors = $(".success-container").children("div.success")
  // get the messages in the message field
  var messageArr = Object.values(messages)
  messageArr.forEach(function(msg, idx) {
    $errors.eq(idx).show().children("span").text(msg)
  })
}

// clears the inputs of a form (jquery) that is passed in
function clearForm($form) {
  console.log("clearing...", $form.children("input"))
  $form.find("input.input").val("")
}
