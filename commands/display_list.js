const { Client } = require("tplink-smarthome-api");
const { exec } = require("child_process");
const devices = require("../lib/devices.json");
const { errorMessage, successMessage } = require("../utils");
const client = new Client();

let deviceDisplayList = [];
const deviceList = [].concat(devices.plugs, devices.lights);
const types = {
  "--light": devices.lights,
  "--plug": devices.plugs
};

module.exports = ([type]) => {
  let deviceTypeArray;

  if (type) {
    let deviceTypeArray = types[type];
    if (!deviceTypeArray) {
      errorMessage("Type does not exist. (--light | --plug)");
      return;
    }
  } else {
    deviceTypeArray = deviceList;
  }

  deviceTypeArray.forEach(d => {
    const t = client
      .getDevice({ host: d.ip })
      .then(device => {
        device.getSysInfo().then(info => {
          let deviceDetails;

          if (typeof info.light_state !== "undefined") {
            deviceDetails = {
              ...d,
              icon: "💡",
              state: { 0: "Off", 1: "On" }[info.light_state.on_off]
            };
            console.log(deviceDetails);
            console.log("\n");
          }

          if (typeof info.relay_state !== "undefined") {
            deviceDetails = {
              ...d,
              icon: "🔌",
              state: { 0: "Off", 1: "On" }[info.relay_state]
            };
            console.log(deviceDetails);
            console.log("\n");
          }
        });
      })
      .catch(err => {
        errorMessage(`Failed to retrieve ${deviceTypeArray[0].name}\n\n${err}`);
      });
  });
};
