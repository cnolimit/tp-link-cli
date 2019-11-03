const { Client } = require("tplink-smarthome-api");
const { exec } = require("child_process");
const devices = require("./devices.json");
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

const [_, folder, type, deviceName, _state] = process.argv;

if (type) {
  const state = _state && _state.toLowerCase();
  let deviceTypeArray = types[type];
  let onOffState = states[state];
  const header = {
    error: "\n\n================= ERROR =================\n\n⛔ ",
    succes: "\n\n================= SUCCESS =================\n\n✅ "
  };

  if (!deviceTypeArray) {
    console.log(`${header.error}Type does not exist. (--light | --plug)\n\n`);
    return;
  }

  if (!deviceName) {
    console.log(
      `${header.error}Provide a valid device name i.e Frontroom TV\n\n`
    );
    return;
  }

  if (!onOffState) {
    console.log(`${header.error}Provide a valid state (on | off)\n\n`);
    return;
  }

  deviceTypeArray = deviceTypeArray.filter(dev => {
    if (dev.name.toLowerCase().includes(deviceName.toLowerCase())) {
      return dev;
    }
  });

  if (deviceTypeArray.length === 0) {
    console.log(`${header.error}Found 0 matching devices:\n\n`);
    return;
  }

  if (deviceTypeArray.length > 1) {
    console.log(`${header.error}Found multiple matching devices:\n\n`);
    deviceTypeArray.forEach(d => {
      console.log(`name: '${d.name}'\n`);
    });
    return;
  }

  client.getDevice({ host: deviceTypeArray[0].ip }).then(device => {
    // https://github.com/plasticrake/tplink-smarthome-api#readme
    const newState = { on: true, off: false }[state];
    const devIcon = { "--light": "💡", "--plug": "🔌" }[type];
    device.setPowerState(newState);

    console.log(
      `${header.succes}Successfuly switched ${state} ${deviceTypeArray[0].name} ${devIcon}\n\n`
    );
  });
}
