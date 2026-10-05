import { getMobileAppConfig } from "../services/admin/adminAppConfig.service.js";

export const checkAppUpdate = async (req, res, next) => {
  try {
    const { platform, version } = req.query;

    const result = await getMobileAppConfig(platform, version);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
