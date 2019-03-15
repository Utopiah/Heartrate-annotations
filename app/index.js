import * as fs from "fs";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { vibration } from "haptics";

var data = '';
var filename = "timedstates.csv";
var baseHeartRate = 65

let instructions = document.getElementById("instructions");
instructions.text = 'Ready'

document.onkeypress = function(e) {
  if (e.key == "back"){
    return
  }
  var positive
  if (e.key == "up"){
    positive = true
  }
  if (e.key == "down"){
    positive = false
  }
  var date = Date.now()
  data += `\n${date},${positive}`
  console.log(data)
  save()
  instructions.text = date;
}
try {
  let stats = fs.statSync(filename);
}
catch(err) {
  console.log('file did not exist, create')
  save(data)
}

if (stats) {
  let utf8_read = fs.readFileSync(filename, "utf-8");
  console.log("UTF-8 Data: " + utf8_read);
  data = utf8_read
}

//clearDataFile()
function clearDataFile(){
  fs.writeFileSync(filename, '', "utf-8");
}

function save(){
  fs.writeFileSync(filename, data, "utf-8");
}

let hrm = new HeartRateSensor();
hrm.onreading = function() {
  console.log(hrm.heartRate)
  if (hrm.heartRate > baseHeartRate){
    instructions.text = 'Spiking, add moment?';
    vibration.start("ping");
  }

}
hrm.start();
