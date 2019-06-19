const electron = require('electron')
const {dialog} = electron.remote
const fs = require('fs')
const usbDetect = require('usb-detection')
const usb = require('usb')
const drivelist = require('drivelist');
const pathModule = require('path')
const path = require('path')
const storagePath = path.join(__dirname, "..", "..", "login_src", "storage", "token.txt")

// device properties of the Amphibian
const amphibian = {
  name: "HS USB FlashDisk",
  description: "ACTIONS USB DISK FOB 2.0 Media",
}

// constant messages/paths
const ampNotFound = "Amphibian was not detected. Make sure the device is plugged in."
const uploadRoute = "http://localhost:8080/upload"

// // start listening for usb inserts. Grab the data file when earbuds plugged in
// usbDetect.startMonitoring();
//
// // check if the Amphibian is already plugged in before app launched
// usbDetect.find(function(err, devices) {
//   if (err) console.log(err)
//   console.log('find', devices)
//   devices.forEach(function(device, idx) {
//     if (device.deviceName == amphibian.name) {
//       console.log("found amphibian")
//     }
//   })
// })

// // check if user plugged in Amphibian after starting the desktop app
// usbDetect.on('add', function(device) {
//   console.log('add', device)
//
//   // check if it's the Amphibian
//   if (device.deviceName == "HS USB FlashDisk") {
//     console.log("found the amphibian!")
//   }
// })

function uploadFile(file, token) {
  var headers = new Headers()
  headers.append("authorization", `Bearer ${token}`)

  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
      req.onreadystatechange = function() {
      if (this.readyState === this.DONE) {
        if (req.status === 200) {
          resolve(req.status)
        } else {
          reject(req.status)
        }
      }
    }
    const postFormData = new FormData();
    postFormData.append("uploadedFile", file, file.name);

    req.open("POST", uploadRoute);
    req.setRequestHeader("authorization", `Bearer ${token}`)

    req.send(postFormData);
  })
}

function readFile(path) {
  var contents = fs.readFileSync(path)
  var uploadFile = new File([toArrayBuffer(contents)], "uploadedFile.txt")
  return uploadFile
}

function toArrayBuffer(myBuf) {
   var myBuffer = new ArrayBuffer(myBuf.length);
   var res = new Uint8Array(myBuffer);
   for (var i = 0; i < myBuf.length; ++i) {
      res[i] = myBuf[i];
   }
   return myBuffer;
}

document.getElementById("uploadButton").onclick = async function() {
  // get list of usbs/drives
  const drives = await drivelist.list()
  var detectAmphibian = false

  // iterate through each drive to find amphibian
  drives.forEach(async function(drive) {
    console.log(drive)
    // amphibian is plugged into the user's computer
    if (drive.description == amphibian.description) {
      console.log("found it!")
      detectAmphibian = true
      // get the path to the amphibian
      var usbPath = drive.mountpoints[0].path

      fs.readFile(storagePath, function(err, data) {
        if (err) throw err
        // read and upload the data file
        var trackedActivities = readFile(pathModule.join(usbPath, "SADATA.TXT"))
        console.log(trackedActivities)
        var uploadPromise = uploadFile(trackedActivities, data.toString())
        uploadPromise.then((status) => {
          console.log("successfully updated database")
        })
        uploadPromise.catch((status) => {
          alert("something went wrong with the upload to the database")
        })
      })
    }
  })

  if (!detectAmphibian) {
    alert(ampNotFound)
  }

  // var fileContents = readFile("/Users/David/Desktop/SADATA.TXT")
  // console.log(toArrayBuffer(fileContents.buffer))
  // var uploadedFile = new File([toArrayBuffer(fileContents)], "uploadedFile.txt")
  // // fs.writeFileSync("temp.txt", fileContents)
  // var uploadProm = uploadFile(uploadedFile)
  //
  // uploadProm.then((status) => {
  //   console.log("request status is after resolve: ", status)
  // })
  //
  // uploadProm.catch((status) => {
  //   console.log("request status is after catch: ", status)
  // })
}
