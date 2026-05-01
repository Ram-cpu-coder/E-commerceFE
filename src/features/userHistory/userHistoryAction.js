import { getOrCreateSession } from "../../utils/sessionHistory"
import { createUserHistory, getRecommendationsApi } from "./userHistoryAPI";
import { setHotPicks } from "./userHistorySlice";


export const createUserHistoryAction = (data) => async (dispatch) => {
    const { userId } = data;
    console.log(data)
    const sessionId = !userId ? getOrCreateSession() : null;
    try {
        const payload = {
            ...(userId ? {} : { guestSessionId: sessionId }),
            ...data
        };

        await createUserHistory(payload);
        dispatch(getRecommendationsAction(userId))
    } catch (error) {
        console.log(error?.message)
    }

}

export const getRecommendationsAction = (userId) => async (dispatch) => {

    const sessionId = !userId ? getOrCreateSession() : null;
    try {
        const payload = {
            ...(userId ? { userId } : { guestSessionId: sessionId })
        };
        const { top10Products } = await getRecommendationsApi(payload)
        dispatch(setHotPicks(top10Products))

    } catch (error) {
        console.log(error?.message)
    }

}