import { getAdminDashboard } from "../../services/admin/adminDashboard.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await getAdminDashboard(req.admin);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};
