const { errorMessage } = require("./utils");

const commands = {
  toggle: require("./commands/toggle.js"),
  display: require("./commands/display_list.js")
};

const [_, dir, _command, ...args] = process.argv;

const command = commands[_command];

if (!command) {
  errorMessage(
    `Command does not exists.\n\n Available commands: (${Object.keys(
      commands
    ).join(" |")})`
  );
} else {
  command([...args]);
}
