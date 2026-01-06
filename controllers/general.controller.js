import { getAllShortLinks } from "../services/shortener.services.js";

export const getHomePage = async (req, res) => {
  try {
    if (!res.locals.user) return res.redirect("/login");

    const links = await getAllShortLinks({ userId: res.locals.user.id });

    res.render("index", {
      errors: req.flash("error"),
      links,
      host: req.get("host"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
