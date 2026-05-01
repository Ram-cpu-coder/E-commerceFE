import {
  fetchUserApi,
  getAllUsersTimeFrame,
  loginApi,
  logoutApi,
  refreshTokenApi,
  registerApi,
  resendVerificationLinkApi,
  updatePwApi,
  updateUserApi,
  verifyEmailAndSendOTPApi,
  verifyOTPApi,
  verifyUserApi,
} from "./userApi";
import { toast } from "react-toastify";
import { resetUser, setTimeFramePastWeekUsers, setTimeFramePresentWeekUsers, setUser } from "./userSlice.js";
import { createRecentActivity } from "../recentActivity/recentActivityAPI.js";

// login action
export const loginAction = (form, navigate) => async (dispatch) => {
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
    navigate("/")
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
    dispatch(createRecentActivity(obj))
  } else {
    toast.error(message)
  }
};

//verify user Action
export const verifyUserAction = ({ sessionId, token }) =>
  async () => {
    const pending = verifyUserApi({ sessionId, token });
    console.log(sessionId, token)
    toast.promise(pending, {
      pending: "Verifying...",
    });
    const { status, message } = await pending;
    toast[status](message);
  };

// verify email action
export const verifyEmailAndSendOTPAction = (email) => async (dispatch) => {
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
  async (dispatch) => {
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
    const pending = updatePwApi({ email, Otp, password, confirmPassword });
    toast.promise(pending, {
      pending: "Updating Password!",
    });

    const { status, message, updatedUser } = await pending;
    toast[status](message);
    console.log(status, "status");
    if (status === "success") {
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
    console.log(error);
    if (error.messgae === "jwt expired") {
      sessionStorage.removeItem("accessJWT");
      localStorage.removeItem("refreshJWT");
    }
    toast.error("Session expired, please login again");
  }
};

export const getAdminUsersPresentWeekTimeFrameAction = (startTime, endTime) => async (dispatch) => {

  const { status, message, users } = await getAllUsersTimeFrame(startTime, endTime);

  await dispatch(setTimeFramePresentWeekUsers(users))
  if (status === "success") {
    return true
  }
}

export const getAdminUsersPastWeekTimeFrameAction = (startTime, endTime) => async (dispatch) => {

  const { status, message, users } = await getAllUsersTimeFrame(startTime, endTime);

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
  } catch (error) {
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
  } catch (error) {
    console.log(error?.message, 5555)
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
  }
  toast[status](message)
}

// resending the verification link 
export const resendVerificationLinkAction = (email) => async (dispatch) => {
  const pending = resendVerificationLinkApi(email)
  toast.promise(pending, {
    pending: "Sending..."
  })
  const { status, message, user } = await pending
  toast[status](message)
  if (status === "success") {
    return true
  }
}