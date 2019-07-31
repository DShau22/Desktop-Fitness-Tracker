const electron = require('electron')
const fs = require('fs')
const usbDetect = require('usb-detection')
const usb = require('usb')
const drivelist = require('drivelist');
const pathModule = require('path')
const path = require('path')
const async = require('async')
const storagePath = path.join(__dirname, "..", "..", "storage", "token.txt")

// device properties of the Amphibian
const amphibian = {
  name: "HS USB FlashDisk",
  description: "ACTIONS USB DISK FOB 2.0 Media",
}

const ampNotFound = "Amphibian was not detected. Make sure the device is plugged in."
const getActivitiesRoute = "http://localhost:8080/getUserActivities"
const activities = ["run", "jump", "swim"]

// STEPS
// 1. send request to getUserActivities
// 2. display their run, swim, jump data to test for correctness
// 3. create a file with this data written to it in some arbitrary format for now
// 4. download such file into a usb flash

function getToken() {
  return new Promise(function(resolve, reject){
    fs.readFile(storagePath, 'utf-8', (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
}

$(document).ready(function() {
  $(document).on("click", "#download-button", async function() {
    console.log("clicked!")
    try {
      var token = await getToken()
    } catch(e) {
      throw e
    }
    console.log(token)
    var promises = []
    activities.forEach((activity, idx) => {
      var headers = new Headers()
      headers.append("authorization", `Bearer ${token}`)
      headers.append("activity", activity)
      var jsonPromise = fetch(getActivitiesRoute, {
        method: "GET",
        headers,
      }).then(res => res.json())
      promises.push(jsonPromise)
    })
    console.log(promises)
    Promise.all(promises).then((values) => {
      console.log(values)
    })
  })
})