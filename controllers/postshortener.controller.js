import z from "zod";
import {
  deleteShortLink,
  getShortLinkById,
  getShortLinkByShortCode,
  insertShortLink,
  updateShortLink,
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

//get edit page
export const getUrlShortnerEditPage = async (req, res) => {
  if (!res.locals.user) return res.redirect("/login");

  const { data: id, error } = z.coerce.number().safeParse(req.params.id);
  if (error) return res.redirect("/");

  try {
    const shortLink = await getShortLinkById(id);

    if (!shortLink) return res.redirect("/");

    const { url, shortCode } = shortLink;

    res.render("edit-shortlink", {
      id,
      url,
      shortCode,
      host: req.get("host"),
      errors: req.flash("error"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

//post edit page
export const postUrlShortnerEditPage = async (req, res) => {
  if (!res.locals.user) return res.redirect("/login");

  const { data: id, error } = z.coerce.number().safeParse(req.params.id);
  if (error) return res.redirect("/");

  try {
    const { url, shortCode } = req.body;
    const existsShortLink = await getShortLinkByShortCode(shortCode);

    if (existsShortLink) {
      req.flash("error", "Short code already exists");
      return res.redirect("/");
    }

    const newUpdateShortLink = await updateShortLink({ id, shortCode, url });
    if (!newUpdateShortLink) return res.redirect("/");

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

//delete
export const deleteShortCode = async (req, res) => {
  if (!res.locals.user) return res.redirect("/login");

  const { data: id, error } = z.coerce.number().safeParse(req.params.id);
  if (error) return res.redirect("/");

  try {
    await deleteShortLink(id);

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
