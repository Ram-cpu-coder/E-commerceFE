import { v4 as uuidv4 } from "uuid";

export const getOrCreateSession = () => {
    let sessionId = localStorage.getItem("guestSessionId")
    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem("guestSessionId", sessionId)
    }
    return sessionId;
}