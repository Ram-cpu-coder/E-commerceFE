import { apiProcessor } from "../../services/apiProcessor";


const chatEp = "/chat";

export const chatApi = (question) => {
  return apiProcessor({
    method: "post",
    url: import.meta.env.VITE_BACKEND_BASE_URL + chatEp,
    data: { question },
  });
};
