const loginRoutes = require("./login");

const constructorMethod = (app) => {
  //app.use("/login", loginRoutes);

  app.get("/", (req, res) => {
    //res.render("login/index", {
    res.render("../src/views/login/index", {
      title: "Please signin",
    });
  });

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
