import Announcement from "../models/announcement.model.js";

export const getActiveAnnouncements = async () => {
  const now = new Date();

  return Announcement.find({
    isActive: true,
    startDate: {
      $lte: now,
    },
    $or: [
      {
        endDate: null,
      },
      {
        endDate: {
          $gte: now,
        },
      },
    ],
  })
    .sort({
      startDate: -1,
      createdAt: -1,
    })
    .lean();
};
