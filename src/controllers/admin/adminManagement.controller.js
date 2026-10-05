import * as adminManagementService from "../../services/admin/adminManagement.service.js";

export async function listAdmins(req, res, next) {
  try {
    const result = await adminManagementService.listAdmins(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getAdmin(req, res, next) {
  try {
    const data = await adminManagementService.getAdmin(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function createAdmin(req, res, next) {
  try {
    const data = await adminManagementService.createAdmin({
      actor: req.admin,
      data: req.body,
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateAdmin(req, res, next) {
  try {
    const data = await adminManagementService.updateAdmin({
      actor: req.admin,
      id: req.params.id,
      data: req.body,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateAdminStatus(req, res, next) {
  try {
    const data = await adminManagementService.updateAdminStatus({
      actor: req.admin,
      id: req.params.id,
      isActive: req.body.isActive,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function deleteAdmin(req, res, next) {
  try {
    const data = await adminManagementService.deleteAdmin({
      actor: req.admin,
      id: req.params.id,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getAdminRoles(req, res, next) {
  try {
    const data = await adminManagementService.getAdminRoles();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
