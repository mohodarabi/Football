exports.get404 = (req, res) => {
  res.render("404", {
    pageTitle: "صفحه پیدا نشد | 404",
    path: "/404",
  });
};

exports.get500 = (req, res) => {
  res.render("500", {
    pageTitle: "صفحه پیدا نشد | 404",
    path: "/500",
  });
};
