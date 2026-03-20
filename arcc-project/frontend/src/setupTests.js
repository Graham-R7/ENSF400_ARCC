global.IS_REACT_ACT_ENVIRONMENT = true;

if (typeof TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");

  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
