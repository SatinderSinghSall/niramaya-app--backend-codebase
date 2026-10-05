import {
  getMaintenanceConfig,
  createMaintenanceConfig,
  updateMaintenanceConfig,
  deleteMaintenanceConfig,
} from "../../services/admin/adminMaintenance.service.js";

export const getMaintenance = async (req, res, next) => {
  try {
    const config = await getMaintenanceConfig();

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

export const createMaintenance = async (req, res, next) => {
  try {
    const config = await createMaintenanceConfig(req.body);

    res.status(201).json({
      success: true,
      message: "Maintenance configuration created successfully.",
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMaintenance = async (req, res, next) => {
  try {
    const config = await updateMaintenanceConfig(req.body);

    res.status(200).json({
      success: true,
      message: "Maintenance configuration updated successfully.",
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMaintenance = async (req, res, next) => {
  try {
    const result = await deleteMaintenanceConfig();

    res.status(200).json({
      success: true,
      data: result,
      message: "Maintenance configuration deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
