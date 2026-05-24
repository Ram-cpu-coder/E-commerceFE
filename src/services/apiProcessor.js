import axios from "axios";

const authEp = import.meta.env.VITE_BACKEND_BASE_URL + "/auth";

const CACHE_TTL_MS = 60_000;

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
const getRefreshJWT = () => sessionStorage.getItem("refreshJWT");

const getCachedPayload = (url) => {
  const entry = apiCache.get(url);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    apiCache.delete(url);
    return null;
  }
  return entry.data;
};

const buildCacheKey = (url, data) => {
  if (!data || typeof data !== "object") return url;
  const params = new URLSearchParams();
  Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, value]) => params.append(key, String(value)));
  const query = params.toString();
  return query ? `${url}?${query}` : url;
};

export const apiProcessor = async ({
  method,
  url,
  isPrivate,
  isRefreshToken = false,
  data,
  contentType = "application/json",
  responseType = undefined,
}) => {
  const cacheKey = method === "get" ? buildCacheKey(url, data) : url;

  if (method === "get" && !isPrivate && !isRefreshToken) {
    const cached = getCachedPayload(cacheKey);
    if (cached !== null) return cached;
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
    const response = await axios({
      method,
      url,
      data: method === "get" ? undefined : data,
      params: method === "get" ? data : undefined,
      headers,
      responseType,
    });

    if (method === "get" && !isPrivate && !isRefreshToken) {
      apiCache.set(cacheKey, { data: response.data, ts: Date.now() });
    }

    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const errorMsg = error?.response?.data?.message || error.message;

    if (
      (status === 401 || errorMsg === "jwt expired") &&
      !isRefreshToken &&
      isPrivate
    ) {
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
            }
            throw new Error("Invalid refresh response");
          } catch (refreshError) {
            console.warn("Token refresh failed:", refreshError.message);
            sessionStorage.removeItem("accessJWT");
            sessionStorage.removeItem("refreshJWT");
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
      }
      return {
        status: "error",
        message: "Session expired. Please log in again.",
      };
    }

    return { status: "error", message: errorMsg };
  }
};
