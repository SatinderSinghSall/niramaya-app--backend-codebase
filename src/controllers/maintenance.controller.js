import { getMobileMaintenanceConfig } from "../services/admin/adminMaintenance.service.js";

export const checkMaintenance = async (req, res, next) => {
  try {
    const maintenance = await getMobileMaintenanceConfig();

    res.status(200).json({
      success: true,
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};
