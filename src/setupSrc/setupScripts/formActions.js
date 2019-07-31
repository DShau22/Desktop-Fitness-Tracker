const fs = require('fs')
const usbDetect = require('usb-detection')
const usb = require('usb')
const drivelist = require('drivelist');
const pathModule = require('path')

// device properties of the Amphibian
const amphibian = {
  name: "HS USB FlashDisk",
  description: "ACTIONS USB DISK FOB 2.0 Media",
}

// display the loading screen and hide everything else
function toggleLoad(messages) {
  // $("tab-1").toggle()
  // $("tab-2").toggle()
  // $(".tab").toggle()
  // $(".login-form").toggle()
  // $(".loading-screen").toggle()
}

// constant messages/paths
const ampNotFound = "Amphibian was not detected. Make sure the device is plugged in."

var currentTab = 0
$(document).ready(function() {
  $(document).on("click", "#prevBtn", function() { nextPrev(-1) })
  $(document).on("click", "#nextBtn", function() { nextPrev(1) })
  $(document).on("submit", "#signUp", function() { submit() })
  showTab(currentTab)
})

function showTab(n) {
  console.log("n is: ", n)
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n === 0) {
    $("#prevBtn").css("display", "none")
  } else {
    $("#prevBtn").css("display", "inline")
  }
  if (n === (x.length - 1)) {
    $("#nextBtn").css("display", "none")
  } else {
    $("#nextBtn").css("display", "inline")
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("signUp").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function scanDrives(drives) {
  var foundAmphibian = false
  var code;
  drives.forEach((drive) => {
    if (drive.description == amphibian.description) {
      console.log("found amphibian!")
      foundAmphibian = true
      // read the file that has the id of the amphibian in it!
      var contents = fs.readFileSync(pathModule.join(drive.mountpoints[0].path, "id.json"))
      console.log("contents", contents)
      code = JSON.parse(contents).productCode
      console.log("parse contents", code)

      if (!code) {
        alert("The id files have been moved or deleted from the device. Contact us for support.")
      }
    }
  })
  // amphibian was not found
  if (!foundAmphibian) {
    alert("amphibian not detected, please make sure the device is plugged in")
  } else {
    return code
  }
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}

async function submit() {
  console.log("submitting...")

  var email = $("#email-input").val()
  var password = $("#pw-input").val()
  var passwordConf = $("#reap-pw-input").val()
  var firstName = $("#first-name").val()
  var lastName = $("#last-name").val()
  var username = $("#username").val()
  var productCode;

  if (password !== passwordConf) {
    alert("make sure passwords match")
  }

  // get list of usbs/drives
  var drives;
  try {
    drives = await drivelist.list()
  } catch(e) {
    throw e
  }

  // scans the drives to find the amphibian
  productCode = scanDrives(drives)
  if (!productCode) {
    return alert("prod code was not found!")
  }
  var reqBody = {
    email,
    password,
    passwordConf,
    firstName,
    lastName,
    username,
    productCode,
  }

  // send post request to server for signing up
  try {
    var ajaxResp = await $.ajax({
      url: "http://localhost:8080/api/account/signup",
      type: "POST",
      contentType: 'application/json',
      data: JSON.stringify(reqBody),
      dataType: 'json',
    })
    const { success, messages } = ajaxResp
    console.log("ajax response is: ", ajaxResp)
    if (success) {
      alert("success!")
    } else {
      alert("failed!")
      console.log(messages)
    }
    // toggle back so loading screen hides, elements show
    // toggleLoad()
  } catch(e) {
    throw e
  }
}

module.exports = {
  nextPrev,
  showTab,
  validateForm,
  fixStepIndicator,
  submit,
}
