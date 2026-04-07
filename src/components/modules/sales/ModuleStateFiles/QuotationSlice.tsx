import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AppDispatch, RootState } from "../../../../ApplicationState/Store";
import Swal from "sweetalert2";

const initialState = {
    quotations: [],
    quotation: {
        "id": "",
        "quote_id": "",
        "company_name": "",
        "total": "",
        "opportunity_id": 2,
        "lead_id": 2,
        "contact_person": "",
        "email": "",
        "phone": "",
        "quotation_date": null,
        "valid_until": "",
        "subtotal": "",
        "discount": "",
        "tax": "",
        "status": "",
        "notes": "",
        "created_by": "",
        "created_at": "",
        "updated_at": "",
        "created_by_name": "",
        "products": [
            {
                "id": "",
                "quotation_id": "",
                "product_name": "",
                "quantity": "",
                "unit_price": "",
                "total_price": ""
            }
        ]
    },
    loading: false,
    error: null,
};

const SalesQuotation = createSlice({
    name: "SalesQuotation",
    initialState,
    reducers: {
        getSalesQuotationRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        getSalesQuotationsSuccess: (state, action) => {
            state.loading = false;
            state.quotations = action.payload?.data || null;
            state.error = null;
        },

        getSalesSingleQuotationSuccess: (state, action) => {
            state.loading = false;
            state.quotation = action.payload?.data || null;
            state.error = null;
        },

        getSalesQuotationFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // state.products = [];
        },

        clearSalesErrors: (state) => {
            state.error = null;
        },
    },
});

export const {
    getSalesQuotationRequest,
    getSalesQuotationsSuccess,
    getSalesSingleQuotationSuccess,
    getSalesQuotationFailure,
    clearSalesErrors,
} = SalesQuotation.actions;

export default SalesQuotation.reducer;

// GET quotation's THUNK
export const getQuotations = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(getSalesQuotationRequest());
    try {
        Swal.fire({
            title: "Loading Quotations...",
            text: "Please wait while we fetch the data.",
            allowOutsideClick: false,
            customClass: {
                loader: 'lead-loader'
            },
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const token = getState().auth.token || localStorage.getItem("token");
        console.log("Token Before get Employee Request", token);
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/sales/quotations`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Opportunities response data:", data);
        // SUCCESS
        dispatch(getSalesQuotationsSuccess(data));
        console.log("Opportunities data after getOpportunities:", data);
        Swal.close();
    } catch (error: any) {
        Swal.close();

        const status = error.response?.status;
        const message =
            error.response?.data?.message || "Something went wrong";

        switch (status) {
            case 400:
                dispatch(getSalesQuotationFailure(message || "Invalid request"));
                break;

            case 401: // invalid token or not logged in
                dispatch(getSalesQuotationFailure(message || "Please provide a valid token"));
                break;

            case 403: // role mismatch or insufficient permissions
                dispatch(getSalesQuotationFailure(message || "Unauthorized access"));
                break;

            case 404:
                dispatch(getSalesQuotationFailure(message || "No Sales Opportunities found"));
                break;

            case 409: //optional (not needed here)
                dispatch(getSalesQuotationFailure(message || "Conflict error"));
                break;

            case 500:
                dispatch(getSalesQuotationFailure("Server error"));
                break;

            default:
                dispatch(getSalesQuotationFailure(message));
        }
    }
};

// GET OPPORTUNITY THUNK
export const getQuotation = (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(getSalesQuotationRequest());
    try {
        Swal.fire({
            title: "Loading Quotation Details...",
            text: "Please wait while we fetch the data.",
            allowOutsideClick: false,   
            customClass: {
                loader: 'lead-loader'
            },
            didOpen: () => {
                Swal.showLoading();
            }
        });
        const token = getState().auth.token || localStorage.getItem("token");
        console.log("Token Before get Employee Request", token);
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/sales/quotations/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Opportunities response data:", data);
        // SUCCESS
        dispatch(getSalesSingleQuotationSuccess(data));
        console.log("Opportunities data after getOpportunities:", data);
        Swal.close();
    } catch (error: any) {
        Swal.close();
        const status = error.response?.status;
        const message =
            error.response?.data?.message || "Something went wrong";

        switch (status) {
            case 400:
                dispatch(getSalesQuotationFailure(message || "Invalid request"));
                break;

            case 401: // invalid token or not logged in
                dispatch(getSalesQuotationFailure(message || "Please provide a valid token"));
                break;

            case 403: // role mismatch or insufficient permissions
                dispatch(getSalesQuotationFailure(message || "Unauthorized access"));
                break;

            case 404:
                dispatch(getSalesQuotationFailure(message || "No Sales Opportunities found"));
                break;

            case 409: //optional (not needed here)
                dispatch(getSalesQuotationFailure(message || "Conflict error"));
                break;

            case 500:
                dispatch(getSalesQuotationFailure("Server error"));
                break;

            default:
                dispatch(getSalesQuotationFailure(message));
        }
    }
};