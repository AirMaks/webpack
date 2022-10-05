module.exports = {
  plugins: {
    "css-mqpacker": {
      sort: function (a, b) {
        return b.localeCompare(a);
      },
    },
  },
};
