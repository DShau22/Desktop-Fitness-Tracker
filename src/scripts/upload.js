const electron = require('electron')
const {dialog} = electron.remote
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    const postFormData = new FormData();
    // postFormData.append('uploadedFile', fs.createReadStream(filePath));
    postFormData.append("uploadedFile", file, file.name);
    postFormData.append("userID", "12345") //change this to be user specific during account login steps

    req.open("POST", "http://localhost:8080/upload");
    req.send(postFormData);
    if (req.status === 200) {
      resolve(req.status)
    } else {
      reject(req.status)
    }
  })
}

function readFile(path) {
  var contents = fs.readFileSync(path)
  return contents
}

function toArrayBuffer(myBuf) {
   var myBuffer = new ArrayBuffer(myBuf.length);
   var res = new Uint8Array(myBuffer);
   for (var i = 0; i < myBuf.length; ++i) {
      res[i] = myBuf[i];
   }
   return myBuffer;
}

document.getElementById("uploadButton").onclick = () => {
  var fileContents = readFile("/Users/David/Desktop/SADATA.TXT")
  console.log(toArrayBuffer(fileContents.buffer))
  var uploadedFile = new File([toArrayBuffer(fileContents)], "uploadedFile.txt")
  // fs.writeFileSync("temp.txt", fileContents)
  var uploadProm = uploadFile(uploadedFile)

  uploadProm.then((status) => {
    console.log("request status is after resolve: ", status)
  })

  uploadProm.catch((status) => {
    console.log("request status is after catch: ", status)
  })
}
