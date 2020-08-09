const loginRoutes = require("./login");
const session = require("express-session");

const constructorMethod = (app) => {
  app.use("/login", loginRoutes);

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
    //check for session info
    res.redirect("/login");
  });

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
