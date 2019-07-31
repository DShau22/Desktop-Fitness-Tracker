const formActions = require("./formActions")
const { showTab } = formActions

var currentTab = 0
$(document).ready(function() {
  showTab(currentTab)
})




// $("#content").on("click", "#signUpButton", function() {
//   var errMessage = {}
//   // get the values of the form submission
//   var email = $("div.sign-up-htm div.group #signup-email").val()
//   var password = $("div.sign-up-htm div.group #signup-pass").val()
//   var reapPassword = $("div.sign-up-htm div.group #reap-pass").val()
//   var firstName = $("div.sign-up-htm div.group #first-name").val()
//   var lastName = $("div.sign-up-htm div.group #last-name").val()
//
//   //make sure 2 passwords are the same
//   if (password !== reapPassword) {
//     errMessage.password = "Error: Passwords must match."
//     showErrors(errMessage)
//   } else {
//     var reqBody = {
//       email,
//       password,
//       firstName,
//       lastName,
//       productCode
//     }
//     // toggles all elements and shows the loading screen
//     toggleLoad()
//
//     // send post request to server for signing up
//     $.ajax({
//       url: "http://localhost:8080/api/account/signup",
//       type: "POST",
//       contentType: 'application/json',
//       data: JSON.stringify(reqBody),
//       dataType: 'json',
//       success: function(data){
//           console.log("device control succeeded");
//       },
//       error: function(){
//           console.log("Device control failed");
//       },
//     })
//       .done(function(data) {
//         const { success, messages } = data
//         if (success) {
//           console.log("success!")
//           clearForm($("#signup-form"))
//           showSuccess({
//             message: "Successfully signed up!"
//           })
//         } else {
//           showErrors(messages)
//         }
//         // toggle back so loading screen hides, elements show
//         toggleLoad()
//       })
//   }
// })
// $("#content").on("click", "#signInButton", function() {
//   console.log("sign in button clicked")
//   // get the values of the form submission
//   var email = $("div.sign-in-htm div.group #login-email").val()
//   var password = $("div.sign-in-htm div.group #login-pass").val()
//   var reqBody = {
//     email,
//     password,
//     remember: isChecked,
//   }
//
//   // toggles all elements and shows the loading screen
//   toggleLoad()
//
//   $.ajax({
//     url: 'http://localhost:8080/api/account/signin',
//     type: "POST",
//     contentType: 'application/json',
//     data: JSON.stringify(reqBody),
//     dataType: 'json',
//     success: function(data){
//         console.log("device control succeeded");
//     },
//     error: function(){
//         console.log("Device control failed");
//     },
//   })
//     .done(function(data) {
//       const { success, messages } = data
//       if (success) {
//         // save the token to a text file
//         fs.writeFile(storagePath, data.token, (err) => {
//           if (err) throw err
//           console.log("success!")
//           $("#content").load("./spasIndex.html", function() {
//             console.log("load was performed")
//           })
//         })
//       } else {
//         showErrors(messages)
//       }
//     })
//     // toggle back so Loading screen hides, elements show
//     toggleLoad()
// })
