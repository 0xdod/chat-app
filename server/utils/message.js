const genMessage = (from, body) => {
  return { from, body, createdAt: new Date().getTime() };
};

module.exports = { genMessage };
