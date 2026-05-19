import {
  fetchUserApi,
  deleteUserApi,
  getAdminAccessRequestsApi,
  getAllUsersApi,
  getAllUsersTimeFrame,
  loginApi,
  logoutApi,
  refreshTokenApi,
  registerApi,
  requestAdminAccessApi,
  resendVerificationLinkApi,
  respondAdminAccessRequestApi,
  updatePwApi,
  updateUserByAdminApi,
  updateUserApi,
  updateUserRoleApi,
  verifyEmailAndSendOTPApi,
  verifyOTPApi,
  verifyUserApi,
} from "./userApi";
import { toast } from "react-toastify";
import { resetUser, setAdminAccessRequests, setAllUsers, setTimeFramePastWeekUsers, setTimeFramePresentWeekUsers, setUser } from "./userSlice.js";
import { createRecentActivity } from "../recentActivity/recentActivityAPI.js";

// login action
export const loginAction = (form, navigate, redirectTo = "/") => async (dispatch) => {
  const pending = loginApi({ ...form });
  toast.promise(pending, {
    pending: "Logging..."
  })
  const { status, message, userInfo, accessToken, refreshToken } = await pending;
  toast[status](message);
  if (status == "success") {
    //upddate storage session for access token
    sessionStorage.setItem("accessJWT", accessToken);
    // update local storage for refresh token
    localStorage.setItem("refreshJWT", refreshToken);
    //update the store
    await dispatch(setUser(userInfo));
    await dispatch(fetchUserAction())
    navigate(redirectTo, { replace: true })
  }
};

// register action
export const registerUserAction = (registerObj) => async (dispatch) => {
  const pending = registerApi(registerObj);
  toast.promise(pending, {
    pending: "Registering ... "
  });
  const { status, message, user } = await pending;
  if (status === "success") {
    const obj = {
      userDetail: {
        userId: user._id,
        userName: user.fName + user.lName
      },
      action: "userRegistration",
      entityId: user._id,
      entityType: "user"
    }
    toast.success(message)
    dispatch(createRecentActivity(obj))
  } else {
    toast.error(message)
  }
};

//verify user Action
export const verifyUserAction = ({ sessionId, token }) =>
  async () => {
    const pending = verifyUserApi({ sessionId, token });
    toast.promise(pending, {
      pending: "Verifying...",
    });
    const { status, message } = await pending;
    toast[status](message);
    return { status, message };
  };

// verify email action
export const verifyEmailAndSendOTPAction = (email) => async () => {
  const pending = verifyEmailAndSendOTPApi(email);

  toast.promise(pending, {
    pending: "Processing...",
  });
  const { status, message } = await pending;
  toast[status](message);
  if (status === "success") {
    return true;
  }
};

export const verifyOTP = ({ email, Otp }) =>
  async () => {
    const pending = verifyOTPApi({ email, Otp });
    toast.promise(pending, { pending: "Verifying OTP..." });
    const { message, status } = await pending;
    toast[status](message);

    if (status === "success") {
      return true;
    }
  };

// Update Password action
export const updatePwAction = ({ email, Otp, password, confirmPassword }) =>
  async (dispatch) => {
    const pending = updatePwApi({
      email,
      Otp: String(Otp),
      password,
      confirmPassword,
    });

    toast.promise(pending, {
      pending: "Updating Password!",
    });

    const { status, message, updatedUser } = await pending;
    toast[status](message);

    if (status === "success") {
      if (updatedUser?._id) {
        const obj = {
          userDetail: {
            userId: updatedUser._id,
            userName: updatedUser.fName + updatedUser.lName,
          },
          action: "userUpdated",
          entityId: updatedUser._id,
          entityType: "user",
        };

        dispatch(createRecentActivity(obj));
      }

      return true;
    }
  };

//fetch user action
export const fetchUserAction = () => async (dispatch) => {
  try {
    const { foundUser } = await fetchUserApi();
    // console.log(data, 666)

    foundUser && dispatch(setUser(foundUser));
  } catch (error) {
    if (error.message === "jwt expired") {
      sessionStorage.removeItem("accessJWT");
      localStorage.removeItem("refreshJWT");
    }
    toast.error("Session expired, please login again");
  }
};

export const getAdminUsersPresentWeekTimeFrameAction = (startTime, endTime) => async (dispatch) => {

  const { status, users } = await getAllUsersTimeFrame(startTime, endTime);

  await dispatch(setTimeFramePresentWeekUsers(users))
  if (status === "success") {
    return true
  }
}

export const getAdminUsersPastWeekTimeFrameAction = (startTime, endTime) => async (dispatch) => {

  const { status, users } = await getAllUsersTimeFrame(startTime, endTime);

  await dispatch(setTimeFramePastWeekUsers(users))
  if (status === "success") {
    return true
  }
}


// auto login action
export const autoLogin = () => async (dispatch) => {
  const accessToken = sessionStorage.getItem("accessJWT");
  const refreshToken = localStorage.getItem("refreshJWT");

  try {
    // when access token available
    if (accessToken) {
      await dispatch(fetchUserAction());
      return;
    }
    //when theres no accessToken but refresh token available
    if (refreshToken) {
      const data = await refreshTokenApi();

      if (data?.accessToken) {
        sessionStorage.setItem("accessJWT", data.accessToken);
        await dispatch(fetchUserAction());
      }
    }
  } catch {
    //remove tokens in case if autologin fail
    sessionStorage.removeItem("accessJWT");
    localStorage.removeItem("refreshJWT");
    toast.error("Session expired, please login again");
  }
};

// logout action 
export const logoutAction = () => async (dispatch) => {
  try {
    const pending = logoutApi();
    toast.promise(pending, {
      pending: "Logging Out..."
    })
    const { status, message } = await pending;
    if (status === "success") {
      localStorage.removeItem("refreshJWT");
      sessionStorage.removeItem("accessJWT")
      await dispatch(resetUser());
      toast[status](message)
      return true;
    }
  } catch {
    return false
  }

}

export const updateUserAction = (obj) => async (dispatch) => {
  const { status, message, updatedUser } = await updateUserApi(obj);
  if (status === "success") {
    dispatch(fetchUserAction())

    const obj = {
      userDetail: {
        userId: updatedUser._id,
        userName: updatedUser.fName + updatedUser.lName
      },
      action: "userUpdated",
      entityId: updatedUser._id,
      entityType: "user"
    }
    dispatch(createRecentActivity(obj))
    toast[status](message)
    return true;
  }
  toast[status](message)
  return false;
}

// resending the verification link 
export const resendVerificationLinkAction = (email) => async () => {
  const pending = resendVerificationLinkApi(email)
  toast.promise(pending, {
    pending: "Sending..."
  })
  const { status, message } = await pending
  toast[status](message)
  if (status === "success") {
    return true
  }
}

export const getAllUsersAction = () => async (dispatch) => {
  const { status, users } = await getAllUsersApi();
  if (status === "success") {
    dispatch(setAllUsers(users));
    return true;
  }
  return false;
}

export const updateUserByAdminAction = (id, obj) => async (dispatch) => {
  const pending = updateUserByAdminApi(id, obj);
  toast.promise(pending, { pending: "Updating user..." });
  const { status, message } = await pending;
  toast[status](message);
  if (status === "success") {
    dispatch(getAllUsersAction());
    return true;
  }
  return false;
};

export const updateUserRoleAction = (id, role) => async (dispatch) => {
  const pending = updateUserRoleApi(id, role);
  toast.promise(pending, { pending: "Updating role..." });
  const { status, message } = await pending;
  toast[status](message);
  if (status === "success") {
    dispatch(getAllUsersAction());
    dispatch(getAdminAccessRequestsAction());
    return true;
  }
  return false;
};

export const deleteUserAction = (id) => async (dispatch) => {
  const pending = deleteUserApi(id);
  toast.promise(pending, { pending: "Deleting user..." });
  const { status, message } = await pending;
  toast[status](message);
  if (status === "success") {
    dispatch(getAllUsersAction());
    return true;
  }
  return false;
};

export const requestAdminAccessAction = (message) => async (dispatch) => {
  const pending = requestAdminAccessApi(message);
  toast.promise(pending, { pending: "Sending request..." });
  const { status, message: responseMessage, user } = await pending;
  toast[status](responseMessage);
  if (status === "success" && user) {
    dispatch(setUser(user));
    return true;
  }
  return false;
};

export const getAdminAccessRequestsAction = () => async (dispatch) => {
  const { status, users } = await getAdminAccessRequestsApi();
  if (status === "success") {
    dispatch(setAdminAccessRequests(users));
    return true;
  }
  return false;
};

export const respondAdminAccessRequestAction = (id, decision, responseMessage) => async (dispatch) => {
  const pending = respondAdminAccessRequestApi(id, decision, responseMessage);
  toast.promise(pending, { pending: "Updating request..." });
  const { status, message } = await pending;
  toast[status](message);
  if (status === "success") {
    dispatch(getAdminAccessRequestsAction());
    return true;
  }
  return false;
};
