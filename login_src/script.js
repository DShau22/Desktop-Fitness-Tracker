const {app, BrowserWindow, remote} = require('electron')

$(document).ready(function(){
  var $signUpButton = $("#signUpButton")
  var $signInButton = $("#signInButton")

  $signUpButton.on("click", function() {

    // get the values of the form submission
    var email = $("div.sign-up-htm div.group #signup-email").val()
    var password = $("div.sign-up-htm div.group #signup-pass").val()
    console.log("123", email, password)
    var reqBody = {email, password}

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
        } else {
          $(".errors-container").show()
          var $errors = $(".errors-container").children("div.error")
          var messageArr = Object.values(messages)
          messageArr.forEach(function(msg, idx) {
            console.log(idx)
            $errors.eq(idx).show().children("span").text(msg)
          })
        }
        // toggle back so loading screen hides, elements show
        toggleLoad()
      })
  })

  $signInButton.on("click", function() {
    // get the values of the form submission
    var email = $("div.sign-in-htm div.group #login-email").val()
    var password = $("div.sign-in-htm div.group #login-pass").val()
    console.log("123", email, password)
    var reqBody = {email, password}

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
          console.log("success!")
          // $.get("spasIndex.html", function(data) {
          //   console.log("get being processsed...")
          //   var content = $(data).find('body').html();
          //   $("#content").html(content);
          //   alert("contents loaded");
          // });
          // remote.getCurrentWindow().loadURL('spasIndex.html')
          $("#content").load("./spasIndex.html", function() {
            console.log("load was performed")
          })
        } else {
          $(".errors-container").show()
          var $errors = $(".errors-container").children("div.error")
          var messageArr = Object.values(messages)
          messageArr.forEach(function(msg, idx) {
            console.log(idx)
            $errors.eq(idx).show().children("span").text(msg)
          })
        }
      })
      // toggle back so Loading screen hides, elements show
      toggleLoad()
  })
})

// display the loading screen and hide everything else
function toggleLoad() {
  $("tab-1").toggle()
  $("tab-2").toggle()
  $(".tab").toggle()
  $(".login-form").toggle()
  $(".loading-screen").toggle()
}
