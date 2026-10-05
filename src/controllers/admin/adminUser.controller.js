import * as adminUserService from "../../services/admin/adminUser.service.js";

export async function listUsers(req, res, next) {
  try {
    const data = await adminUserService.listUsers(req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const data = await adminUserService.getUser(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getUserDetails(req, res, next) {
  try {
    const data = await adminUserService.getUserDetails(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    const data = await adminUserService.updateUserStatus({
      id: req.params.id,
      isActive: req.body.isActive,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const data = await adminUserService.deleteUser({
      id: req.params.id,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
