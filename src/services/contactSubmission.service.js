import ContactSubmission from "../models/contactSubmission.model.js";

function normalize(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createContactSubmission(payload = {}) {
  const name = normalize(payload.name);
  const email = normalize(payload.email).toLowerCase();
  const subject = normalize(payload.subject);
  const message = normalize(payload.message);

  if (!name) {
    throw new Error("Name is required.");
  }

  if (!email || !validateEmail(email)) {
    throw new Error("A valid email address is required.");
  }

  if (!subject) {
    throw new Error("Subject is required.");
  }

  if (!message) {
    throw new Error("Message is required.");
  }

  if (name.length > 100) {
    throw new Error("Name is too long.");
  }

  if (subject.length > 200) {
    throw new Error("Subject is too long.");
  }

  if (message.length > 5000) {
    throw new Error("Message is too long.");
  }

  return ContactSubmission.create({
    name,
    email,
    subject,
    message,
    source: "website",
    status: "new",
  });
}
