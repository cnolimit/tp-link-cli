const { Client } = require("tplink-smarthome-api");
const { exec } = require("child_process");
const devices = require("../lib/devices.json");
const { errorMessage, successMessage } = require("../utils");
const client = new Client();

const deviceList = [].concat(devices.plugs, devices.lights);
const types = {
  "--light": devices.lights,
  "--plug": devices.plugs
};
const states = {
  on: "ON",
  off: "OFF"
};

module.exports = ([type, deviceName, _state]) => {
  if (type) {
    const state = _state && _state.toLowerCase();
    let deviceTypeArray = types[type];
    let onOffState = states[state];
    const toggleClient = clientList => {
      for (let i = 0; i < clientList.length; i++) {
        client
          .getDevice({ host: clientList[i].ip })
          .then(device => {
            // https://github.com/plasticrake/tplink-smarthome-api#readme
            const newState = { on: true, off: false }[state];
            const devIcon = { "--light": "💡", "--plug": "🔌" }[type];
            device.setPowerState(newState);

            successMessage(
              `Successfuly switched ${state} ${clientList[i].name} ${devIcon}`
            );
          })
          .catch(() => {
            errorMessage(`Failed to switch ${state} ${clientList[i].name}`);
          });
      }
    };

    if (!deviceTypeArray) {
      errorMessage("Type does not exist. (--light | --plug)");
      return;
    }

    if (!deviceName) {
      errorMessage("Provide a valid device name i.e Frontroom TV");
      return;
    }

    if (!onOffState) {
      errorMessage("Provide a valid state (on | off)");
      return;
    }

    deviceTypeArray = deviceTypeArray.filter(dev => {
      if (dev.name.toLowerCase().includes(deviceName.toLowerCase())) {
        return dev;
      }
    });

    if (deviceTypeArray.length === 0) {
      errorMessage("Found 0 matching devices:");
      return;
    }

    if (deviceTypeArray.length > 1) {
      errorMessage("Found multiple matching devices:");
      deviceTypeArray.forEach(d => {
        console.log(`name: '${d.name}'\n`);
      });
    }

    toggleClient(deviceTypeArray);
  }
};
