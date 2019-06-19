const {app, BrowserWindow, remote} = require('electron')
const storagePath = __dirname + "/storage/token.txt"
const fs = require("fs")
$(document).ready(function(){
  // show loading screen before the login/spa
  toggleLoad()

  // checks if the checkbox is checked or not after doc loads
  var isChecked = $("#check").prop("checked")
  $("#check").on("click", function(){
    isChecked = $checkbox.prop("checked")
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
        }
      })
  }
  toggleLoad()

  var $signUpButton = $("#signUpButton")
  var $signInButton = $("#signInButton")

  $signUpButton.on("click", function() {
    var errMessage = {}
    // get the values of the form submission
    var email = $("div.sign-up-htm div.group #signup-email").val()
    var password = $("div.sign-up-htm div.group #signup-pass").val()
    var productCode = $("div.sign-up-htm div.group #prod-code").val()
    var reapPassword = $("div.sign-up-htm div.group #reap-pass").val()
    var firstName = $("div.sign-up-htm div.group #first-name").val()
    var lastName = $("div.sign-up-htm div.group #last-name").val()

    //make sure 2 passwords are the same
    if (password !== reapPassword) {
      errMessage.password = "Error: Passwords must match."
      showErrors(errMessage)
    } else {
      var reqBody = {
        email,
        password,
        firstName,
        lastName,
        productCode
      }
      // toggles all elements and shows the loading screen
      toggleLoad()

      // send post request to server for signing up
      $.ajax({
        url: "http://localhost:8080/api/account/signup",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(reqBody),
        dataType: 'json',
        success: function(data){
            console.log("device control succeeded");
        },
        error: function(){
            console.log("Device control failed");
        },
      })
        .done(function(data) {
          const { success, messages } = data
          if (success) {
            console.log("success!")
            clearForm($("#signup-form"))
            showSuccess({
              message: "Successfully signed up!"
            })
          } else {
            showErrors(messages)
          }
          // toggle back so loading screen hides, elements show
          toggleLoad()
        })
    }
  })
  $signInButton.on("click", function() {
    // get the values of the form submission
    var email = $("div.sign-in-htm div.group #login-email").val()
    var password = $("div.sign-in-htm div.group #login-pass").val()
    console.log("123", email, password)
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
      success: function(data){
          console.log("device control succeeded");
      },
      error: function(){
          console.log("Device control failed");
      },
    })
      .done(function(data) {
        const { success, messages } = data
        if (success) {
          fs.writeFileSync(storagePath, data.token)
          console.log("success!")
          $("#content").load("./spasIndex.html", function() {
            console.log("load was performed")
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
    console.log(idx)
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
    console.log(idx)
    $errors.eq(idx).show().children("span").text(msg)
  })
}

// clears the inputs of a form (jquery) that is passed in
function clearForm($form) {
  console.log("clearing...", $form.children("input"))
  $form.find("input.input").val("")
}
