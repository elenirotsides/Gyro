const loginRoutes = require("./login");
const boardRoutes = require("./board");
const registerRoutes = require("./register");
const session = require("express-session");

const constructorMethod = (app) => {
  app.use("/login", loginRoutes);
  app.use("/board", boardRoutes);
  app.use("/register", registerRoutes);

  //set express-session cookie
  app.use(
    session({
      name: "AuthCookie",
      secret: "some secret string!",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.get("/", (req, res) => {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      res.redirect("/board");
    }
  });

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
