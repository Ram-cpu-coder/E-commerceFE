import { apiProcessor } from "../../services/apiProcessor"

const invoiceUrl = import.meta.env.VITE_BACKEND_BASE_URL + "/invoice"
export const generateInvoice = (id) => {
    return apiProcessor({
        method: "get",
        url: invoiceUrl + `/${id}`,
        isPrivate: true,
        responseType: "blob"
    })
}