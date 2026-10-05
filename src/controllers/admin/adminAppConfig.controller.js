import {
  listAppConfigs,
  getAppConfigByPlatform,
  createAppConfig,
  updateAppConfig,
} from "../../services/admin/adminAppConfig.service.js";

export const getAppConfigs = async (req, res, next) => {
  try {
    const configs = await listAppConfigs();

    res.status(200).json({
      success: true,
      data: configs,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppConfig = async (req, res, next) => {
  try {
    const config = await getAppConfigByPlatform(req.params.platform);

    res.status(200).json({
      success: true,
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

export const addAppConfig = async (req, res, next) => {
  try {
    const config = await createAppConfig(req.body);

    res.status(201).json({
      success: true,
      message: "App configuration created successfully.",
      data: config,
    });
  } catch (error) {
    next(error);
  }
};

export const editAppConfig = async (req, res, next) => {
  try {
    const config = await updateAppConfig(req.params.platform, req.body);

    res.status(200).json({
      success: true,
      message: "App configuration updated successfully.",
      data: config,
    });
  } catch (error) {
    next(error);
  }
};
