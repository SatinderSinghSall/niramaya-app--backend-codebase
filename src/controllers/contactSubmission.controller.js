import { createContactSubmission } from "../services/contactSubmission.service.js";

export async function createContactSubmissionController(req, res, next) {
  try {
    const submission = await createContactSubmission(req.body);

    return res.status(201).json({
      success: true,
      message:
        "Your message has been submitted successfully. We will get back to you soon.",
      data: {
        id: submission._id,
      },
    });
  } catch (error) {
    next(error);
  }
}
