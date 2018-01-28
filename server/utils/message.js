const genMessage = (from, body) => {
  return { from, body, createdAt: new Date().getTime() };
};

const genLocMessage = (from, lat, lng) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: new Date().getTime(),
  };
};
module.exports = { genMessage, genLocMessage };
