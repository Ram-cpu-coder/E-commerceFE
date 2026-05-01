import axios from "axios";

const authEp = import.meta.env.VITE_BACKEND_BASE_URL + "/auth";

let isRefreshing = false;
let refreshPromise = null;
export const apiCache = new Map();

export const clearApiCache = (url) => {
  if (url) {
    apiCache.delete(url);
  } else {
    apiCache.clear();
  }
};

const getAccessJWT = () => sessionStorage.getItem("accessJWT");
const getRefreshJWT = () => localStorage.getItem("refreshJWT");

export const apiProcessor = async ({
  method,
  url,
  isPrivate,
  isRefreshToken = false,
  data,
  contentType = "application/json",
  responseType = undefined,
}) => {
  // 1. Quick cache layer for public GETs
  if (method === "get" && !isPrivate && !isRefreshToken && apiCache.has(url)) {
    return apiCache.get(url);
  }

  const headers = {};

  if (isPrivate) {
    const token = getAccessJWT();
    if (token) headers.Authorization = `Bearer ${token}`;
  } else if (isRefreshToken) {
    const token = getRefreshJWT();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = contentType;
  }

  try {
    const response = await axios({ method, url, data, headers, responseType });

    if (method === "get" && !isPrivate && !isRefreshToken) {
      apiCache.set(url, response.data); // cache result
    }

    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const errorMsg = error?.response?.data?.message || error.message;

    // 2. Handle token expiry
    if ((status === 401 || errorMsg === "jwt expired") && !isRefreshToken && isPrivate) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const refreshData = await apiProcessor({
              method: "get",
              url: `${authEp}/renew-jwt`,
              isPrivate: false,
              isRefreshToken: true,
            });

            if (refreshData?.accessToken) {
              sessionStorage.setItem("accessJWT", refreshData.accessToken);
              return refreshData;
            } else {
              throw new Error("Invalid refresh response");
            }
          } catch (refreshError) {
            console.warn("Token refresh failed:", refreshError.message);
            sessionStorage.removeItem("accessJWT");
            localStorage.removeItem("refreshJWT");
            return null;
          } finally {
            isRefreshing = false;
          }
        })();
      }

      const refreshData = await refreshPromise;

      if (refreshData?.accessToken) {
        return apiProcessor({
          method,
          url,
          isPrivate,
          data,
          contentType,
          responseType,
        });
      } else {
        return { status: "error", message: "Session expired. Please log in again." };
      }
    }

    return { status: "error", message: errorMsg };
  }
};
