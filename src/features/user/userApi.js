import { apiProcessor } from "../../services/apiProcessor";

const rootUrl = import.meta.env.VITE_BACKEND_ROOT_URL;

const authUrl = import.meta.env.VITE_BACKEND_BASE_URL + "/auth";

// login api
export const loginApi = (loginObj) => {
  return apiProcessor({
    method: "post",
    url: authUrl + "/signin",
    data: loginObj,
    isPrivate: false,
    isRefreshToken: false,
  });
};
// register api
export const registerApi = (registerObj) => {
  return apiProcessor({
    method: "post",
    url: authUrl + "/register",
    data: registerObj,
  });
};
// verify the user
export const verifyUserApi = ({ sessionId, token }) => {
  return apiProcessor({
    method: "get",
    url: `${rootUrl}/verify-user?sessionId=${sessionId}&t=${token}`,
  });
};
// verify email api
export const verifyEmailAndSendOTPApi = (email) => {
  return apiProcessor({
    method: "post",
    url: rootUrl + "/verify-user/verifyEmail",
    data: email,
  });
};

export const verifyOTPApi = ({ Otp, email }) => {
  return apiProcessor({
    method: "post",
    url: rootUrl + "/verify-user/verify-otp",
    data: {
      Otp: String(Otp),
      email,
    },
  });
};

export const updatePwApi = ({ email, Otp, password, confirmPassword }) => {
  return apiProcessor({
    method: "post",
    url: rootUrl + "/verify-user",
    data: {
      email,
      Otp: String(Otp),
      password,
      confirmPassword,
    },
  });
};
// fetch user api
export const fetchUserApi = () => {
  try {
    return apiProcessor({
      method: "get",
      url: authUrl,
      isPrivate: true,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// refrsh token api
export const refreshTokenApi = async () => {
  try {
    return apiProcessor({
      method: "get",
      url: authUrl + "/renew-jwt",
      isPrivate: false,
      isRefreshToken: true,
    });
  } catch (error) {
    sessionStorage.removeItem("accessJWT");
    sessionStorage.removeItem("refreshJWT");
    throw error;
  }
};
// logout api 
export const logoutApi = async () => {
  return apiProcessor({
    method: "get",
    url: authUrl + "/logout",
    isRefreshToken: true,
    isPrivate: true
  })
}
// update address api
export const updateUserApi = (obj) => {
  return apiProcessor({
    method: "put",
    url: authUrl,
    data: obj,
    isPrivate: true
  });
};
// resending the verification link 
export const resendVerificationLinkApi = (email) => {
  return apiProcessor({
    method: "post",
    url: authUrl + '/verification-email',
    data: { email }
  });
}
export const getAllUsersTimeFrame = (startTime, endTime) => {
  return apiProcessor({
    method: "get",
    url: `${authUrl}/timeFrame?startTime=${startTime}&endTime=${endTime}`,
    isPrivate: true,
  })
}

export const getAllUsersApi = () => {
  return apiProcessor({
    method: "get",
    url: `${authUrl}/users`,
    isPrivate: true,
  });
};

export const updateUserByAdminApi = (id, obj) => {
  return apiProcessor({
    method: "put",
    url: `${authUrl}/users/${id}`,
    data: obj,
    isPrivate: true,
  });
};

export const updateUserRoleApi = (id, role) => {
  return apiProcessor({
    method: "put",
    url: `${authUrl}/users/${id}/role`,
    data: { role },
    isPrivate: true,
  });
};

export const deleteUserApi = (id) => {
  return apiProcessor({
    method: "delete",
    url: `${authUrl}/${id}`,
    isPrivate: true,
  });
};

export const requestAdminAccessApi = (message) => {
  return apiProcessor({
    method: "post",
    url: `${authUrl}/admin-request`,
    data: { message },
    isPrivate: true,
  });
};

export const getAdminAccessRequestsApi = () => {
  return apiProcessor({
    method: "get",
    url: `${authUrl}/admin-requests`,
    isPrivate: true,
  });
};

export const respondAdminAccessRequestApi = (id, decision, responseMessage) => {
  return apiProcessor({
    method: "put",
    url: `${authUrl}/admin-requests/${id}`,
    data: { decision, responseMessage },
    isPrivate: true,
  });
};
