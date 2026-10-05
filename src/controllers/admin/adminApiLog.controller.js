import {
  deleteApiLog,
  getApiLogById,
  listApiLogs,
} from "../../services/admin/adminApiLog.service.js";

export const getApiLogs = async (req, res, next) => {
  try {
    const result = await listApiLogs(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getApiLog = async (req, res, next) => {
  try {
    const log = await getApiLogById(req.params.id);

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

export const removeApiLog = async (req, res, next) => {
  try {
    const log = await deleteApiLog(req.params.id);

    res.status(200).json({
      success: true,
      message: "API log deleted successfully.",
      data: log,
    });
  } catch (error) {
    next(error);
  }
};
