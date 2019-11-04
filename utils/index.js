const output_header = {
  error: "\n\n================= ERROR =================\n\n⛔ ",
  succes: "\n\n================= SUCCESS =================\n\n✅ "
};

const errorMessage = message =>
  console.log(`${output_header.error}${message}\n\n`);
const successMessage = message =>
  console.log(`${output_header.succes}${message}\n\n`);

module.exports = {
  errorMessage,
  successMessage,
  output_header
};
