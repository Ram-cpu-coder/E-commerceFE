import { apiProcessor } from "../../services/apiProcessor";

const shopUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/shops`;

export const getShopsApi = () =>
  apiProcessor({
    method: "get",
    url: shopUrl,
    isPrivate: true,
  });

export const getShopOverviewApi = (id) =>
  apiProcessor({
    method: "get",
    url: `${shopUrl}/${id}/overview`,
    isPrivate: true,
  });

export const getPlatformOverviewApi = () =>
  apiProcessor({
    method: "get",
    url: `${shopUrl}/platform-overview`,
    isPrivate: true,
  });

export const submitShopApplicationApi = (data) =>
  apiProcessor({
    method: "post",
    url: `${shopUrl}/applications`,
    data,
    isPrivate: true,
  });

export const getShopApplicationsApi = (status = "all") =>
  apiProcessor({
    method: "get",
    url: `${shopUrl}/applications?status=${status}`,
    isPrivate: true,
  });

export const respondShopApplicationApi = (id, data) =>
  apiProcessor({
    method: "put",
    url: `${shopUrl}/applications/${id}`,
    data,
    isPrivate: true,
  });

export const getShopApplicationsForSuperAdminApi = (status = "all") =>
  getShopApplicationsApi(status);

export const createShopApi = (data) =>
  apiProcessor({
    method: "post",
    url: shopUrl,
    data,
    isPrivate: true,
  });

export const updateShopApi = (id, data) =>
  apiProcessor({
    method: "put",
    url: `${shopUrl}/${id}`,
    data,
    isPrivate: true,
  });

export const deleteShopApi = (id) =>
  apiProcessor({
    method: "delete",
    url: `${shopUrl}/${id}`,
    isPrivate: true,
  });
