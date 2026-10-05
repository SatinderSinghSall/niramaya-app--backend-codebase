import {
  listAdminConsultations,
  getAdminConsultationById,
  getAdminConsultationStats,
  updateAdminConsultationStatus,
  rescheduleAdminConsultation,
  updateAdminConsultationNotes,
  notifyConsultationUser,
} from "../../services/admin/adminConsultation.service.js";

export const list = async (req, res, next) => {
  try {
    const result = await listAdminConsultations({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      status: req.query.status,
      consultationType: req.query.consultationType,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const stats = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: await getAdminConsultationStats(),
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: await getAdminConsultationById(req.params.id),
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Consultation status updated successfully",
      data: await updateAdminConsultationStatus({
        id: req.params.id,
        ...req.body,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const schedule = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Consultation schedule updated successfully",
      data: await rescheduleAdminConsultation({
        id: req.params.id,
        ...req.body,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotes = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Consultation notes updated successfully",
      data: await updateAdminConsultationNotes({
        id: req.params.id,
        notes: req.body.notes,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const notifyUser = async (req, res, next) => {
  try {
    res.status(201).json({
      success: true,
      message: "Consultation notification sent successfully",
      data: await notifyConsultationUser({
        consultationId: req.params.id,
        ...req.body,
      }),
    });
  } catch (error) {
    next(error);
  }
};
