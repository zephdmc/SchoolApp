// Generates a random unique payment reference string
function generateReference() {
    const timestamp = Date.now(); // milliseconds since epoch
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char alphanumeric
    return `REF-${timestamp}-${randomStr}`;
  }
  
  module.exports = { generateReference };
  