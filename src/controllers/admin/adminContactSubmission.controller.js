import {
  getContactSubmissions,
  getContactSubmissionById,
  updateContactSubmission,
  getContactSubmissionCounts,
} from "../../services/admin/adminContactSubmission.service.js";

export async function getAdminContactSubmissionsController(req, res, next) {
  try {
    const result = await getContactSubmissions({
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
      search: req.query.search,
    });

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminContactSubmissionController(req, res, next) {
  try {
    const submission = await getContactSubmissionById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found.",
      });
    }

    return res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminContactSubmissionController(req, res, next) {
  try {
    const submission = await updateContactSubmission(req.params.id, req.body);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found.",
      });
    }

    return res.json({
      success: true,
      message: "Contact submission updated successfully.",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminContactSubmissionCountsController(
  req,
  res,
  next,
) {
  try {
    const counts = await getContactSubmissionCounts();

    return res.json({
      success: true,
      data: counts,
    });
  } catch (error) {
    next(error);
  }
}
