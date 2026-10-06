import { getActiveAnnouncements as getActiveAnnouncementsService } from "../services/announcement.service.js";

export const getActiveAnnouncements = async (req, res, next) => {
  try {
    const announcements = await getActiveAnnouncementsService();

    return res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
};
