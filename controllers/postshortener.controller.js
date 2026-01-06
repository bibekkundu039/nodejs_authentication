import {
  getShortLinkByShortCode,
  insertShortLink,
} from "../services/shortener.services.js";
import { shortnerSchema } from "../validators/shortner-validator.js";

export const postUrlShortner = async (req, res) => {
  try {
    // if (!req.locals.user) return res.redirect("/login");

    // const { url, shortCode } = req.body;

    const result = shortnerSchema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues?.[0]?.message || "Invalid input";
      req.flash("error", message);
      return res.redirect("/"); // 🔴 MUST return
    }

    const { url, shortCode } = result.data;

    const finalShortCode =
      shortCode || Math.random().toString(36).substring(2, 8);

    if (!url) {
      return res.status(400).send("URL is required");
    }

    const link = await getShortLinkByShortCode(finalShortCode);

    if (link) {
      req.flash("error", "Short code already exists");
      return res.redirect("/");
    }

    await insertShortLink({
      url,
      shortCode: finalShortCode,
      userId: res.locals.user.id,
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
