import ContactSubmission from "../../models/contactSubmission.model.js";

function buildFilter(query = {}) {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search?.trim()) {
    const search = query.search.trim();

    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
    ];
  }

  return filter;
}

export async function getContactSubmissions({
  page = 1,
  limit = 20,
  status = "",
  search = "",
} = {}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const filter = buildFilter({
    status,
    search,
  });

  const [items, total] = await Promise.all([
    ContactSubmission.find(filter)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),

    ContactSubmission.countDocuments(filter),
  ]);

  const pages = Math.max(Math.ceil(total / safeLimit), 1);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages,
      hasNextPage: safePage < pages,
      hasPreviousPage: safePage > 1,
    },
  };
}

export async function getContactSubmissionById(id) {
  return ContactSubmission.findById(id).lean();
}

export async function updateContactSubmission(id, payload = {}) {
  const update = {};

  if (payload.status) {
    update.status = payload.status;

    if (payload.status === "read") {
      update.readAt = new Date();
    }

    if (payload.status === "replied") {
      update.repliedAt = new Date();
      update.readAt = update.readAt || new Date();
    }

    if (payload.status === "archived") {
      update.archivedAt = new Date();
    }
  }

  if (typeof payload.adminNote === "string") {
    update.adminNote = payload.adminNote.trim();
  }

  return ContactSubmission.findByIdAndUpdate(
    id,
    { $set: update },
    {
      new: true,
      runValidators: true,
    },
  ).lean();
}

export async function getContactSubmissionCounts() {
  const [total, newCount, read, replied, archived] = await Promise.all([
    ContactSubmission.countDocuments(),
    ContactSubmission.countDocuments({ status: "new" }),
    ContactSubmission.countDocuments({ status: "read" }),
    ContactSubmission.countDocuments({ status: "replied" }),
    ContactSubmission.countDocuments({ status: "archived" }),
  ]);

  return {
    total,
    new: newCount,
    read,
    replied,
    archived,
  };
}
