import api from "../api/axios";

export function slugify(text) {
  return (text || "evento")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "evento";
}

export function getEventPath(evento) {
  const id = evento?._id || "";
  const slug = slugify(evento?.titolo);
  return `/eventi/${id}/${slug}`;
}

export function fetchEventoById(id) {
  return api.get(`/annunci/${id}`);
}
