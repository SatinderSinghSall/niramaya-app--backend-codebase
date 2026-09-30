import {
  createHealthProfile,
  deleteHealthProfile,
  getHealthProfile,
  updateHealthProfile,
} from "../services/healthProfile.service.js";

export const createProfile = async (req, res, next) => {
  try {
    const profile = await createHealthProfile(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Health profile created successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const profile = await getHealthProfile(req.user._id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Health profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await updateHealthProfile(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Health profile updated successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    await deleteHealthProfile(req.user._id);

    res.status(200).json({
      success: true,
      message: "Health profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
