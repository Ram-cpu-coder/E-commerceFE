import { apiProcessor } from "../../services/apiProcessor";

const platformUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/platform`;

export const getPlatformSettingsApi = () =>
  apiProcessor({
    method: "get",
    url: `${platformUrl}/settings`,
    isPrivate: true,
  });

export const updatePlatformSettingsApi = (data) =>
  apiProcessor({
    method: "put",
    url: `${platformUrl}/settings`,
    data,
    isPrivate: true,
  });

export const getAuditLogsApi = () =>
  apiProcessor({
    method: "get",
    url: `${platformUrl}/audit-logs`,
    isPrivate: true,
  });
