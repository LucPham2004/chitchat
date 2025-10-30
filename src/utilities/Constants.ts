
export const ROUTES = {
  HOME: "/",

  DESKTOP: {
    ROOT: "/d",
    CONVERSATION: (convId = ":conv_id") => `/d/conversations/${convId}`,
    PROFILE: (userId = ":user_id_param") => `/d/profile/${userId}`,
    PROFILE_FRIENDS: (userId = ":user_id_param") => `/d/profile/${userId}/friends`,
    PROFILE_UPDATE: (userId = ":user_id_param") => `/d/profile/${userId}/update`,
  },

  MOBILE: {
    ROOT: "/mobile",
    CONVERSATIONS: "/mobile/conversations",
    CONVERSATION: (convId = ":conv_id") => `/mobile/conversations/${convId}`,
    PROFILE: (userId = ":user_id_param") => `/mobile/profile/${userId}`,
    PROFILE_FRIENDS: (userId = ":user_id_param") => `/mobile/profile/${userId}/friends`,
    PROFILE_UPDATE: (userId = ":user_id_param") => `/mobile/profile/${userId}/update`,
  },

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  CALL: "/call",

  ERROR: "*",
};