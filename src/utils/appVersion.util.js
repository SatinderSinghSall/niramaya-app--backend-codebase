const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

export const isValidAppVersion = (version) => {
  return typeof version === "string" && VERSION_PATTERN.test(version.trim());
};

export const compareAppVersions = (versionA, versionB) => {
  if (!isValidAppVersion(versionA) || !isValidAppVersion(versionB)) {
    const error = new Error(
      "Invalid app version. Use the format major.minor.patch, such as 1.2.0.",
    );

    error.statusCode = 400;
    error.code = "INVALID_APP_VERSION";

    throw error;
  }

  const a = versionA.trim().split(".").map(Number);
  const b = versionB.trim().split(".").map(Number);

  for (let index = 0; index < 3; index += 1) {
    if (a[index] > b[index]) return 1;
    if (a[index] < b[index]) return -1;
  }

  return 0;
};
