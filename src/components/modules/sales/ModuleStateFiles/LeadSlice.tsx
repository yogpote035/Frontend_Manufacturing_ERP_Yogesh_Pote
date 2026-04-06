import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AppDispatch, RootState } from "../../../../ApplicationState/Store";
import Swal from "sweetalert2";

const initialState = {
    lead: {
        "id": "",
        "lead_id": "",
        "company_name": "",
        "contact_person": "",
        "phone": "",
        "email": "",
        "city": "",
        "status": "",
        "priority": "",
        "address": "",
        "state": "",
        "gst_number": "",
        "lead_source": "",
        "expected_close_date": "",
        "followup_date": "",
        "notes": "",
        "assigned_to": "",
        "created_by": "",
        "created_at": "",
        "updated_at": "",
        "assigned_to_name": "",
        "products": [
            {
                "id": 1,
                "lead_id": 1,
                "product_name": "",
                "quantity": 2,
                "total_price": "",
                "product_id": "",
                "variant": "",
                "unit_price": ""
            }
        ]
    },     // single
    leads: [],    // list
    loading: false,
    error: "",
};

const leadSlice = createSlice({
    name: "leads",
    initialState,
    reducers: {
        // Common
        request: (state) => {
            state.loading = true;
            state.error = "";
        },

        failure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        clearErrors: (state) => {
            state.error = "";
        },

        // GET ALL LEADS
        getLeadsSuccess: (state, action) => {
            state.loading = false;
            state.leads = action.payload?.data || action.payload;
        },

        // GET SINGLE LEAD
        getLeadSuccess: (state, action) => {
            state.loading = false;
            state.lead = action.payload?.data || action.payload;
        },

        // CREATE LEAD
        createLeadSuccess: (state, action) => {
            state.loading = false;
            state.lead = action.payload?.data || action.payload;
        },
    },
});

export const {
    request,
    failure,
    clearErrors,
    getLeadsSuccess,
    getLeadSuccess,
    createLeadSuccess,
} = leadSlice.actions;

export default leadSlice.reducer;

// GET ALL LEADS
export const getLeads =
    () => async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(request());
        Swal.fire({
            title: "Loading Leads...",
            text: "Please wait while we fetch the lead data.",
            allowOutsideClick: false,
            customClass: {
                loader: 'lead-loader'
            },
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const token = getState().auth.token || localStorage.getItem("token");

            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/sales/leads`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            dispatch(getLeadsSuccess(data));
            Swal.close();
        } catch (error: any) {
            Swal.close();
            handleError(error, dispatch);
        }
    };

// GET SINGLE LEAD
export const getLead =
    (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(request());
        Swal.fire({
            title: "Loading Lead...",
            text: "Please wait while we fetch the lead details.",
            allowOutsideClick: false,
            customClass: {
                loader: 'lead-loader'
            },
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const token = getState().auth.token || localStorage.getItem("token");

            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/sales/leads/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            dispatch(getLeadSuccess(data));
            Swal.close();
        } catch (error: any) {
            Swal.close();
            handleError(error, dispatch);
        }
    };


// CREATE LEAD
export const createLead = (payload: any) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(request());
    try {
        Swal.fire({
            title: "Creating Lead...",
            text: "Please wait while we create the lead.",
            allowOutsideClick: false,
            customClass: {
                loader: 'lead-loader'
            },
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const token = getState().auth.token || localStorage.getItem("token");

        const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/sales/leads`,
            payload,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        dispatch(createLeadSuccess(data));
        Swal.fire({
            icon: "success",
            iconColor: "#005d52",
            title: "Lead Created",
            text: data.message || "Success",
            timer: 1500,
            showConfirmButton: false,
        });
        Swal.close();
    } catch (error: any) {
        Swal.close();
        handleError(error, dispatch);
    }
};

// COMMON ERROR HANDLER
const handleError = (error: any, dispatch: any) => {
    const status = error.response?.status;
    const message =
        error.response?.data?.message || "Something went wrong";

    switch (status) {
        case 400:
            Swal.fire("Error", message || "Invalid request", "error");
            break;

        case 401:
            Swal.fire("Error", "Unauthorized - Login again", "error");
            break;

        case 403:
            Swal.fire("Error", "Access denied", "error");
            break;

        case 404:
            Swal.fire("Error", "Data not found", "error");
            break;

        case 409:
            Swal.fire("Error", message || "Conflict", "error");
            break;

        case 500:
            Swal.fire("Error", "Server error", "error");
            break;

        default:
            Swal.fire("Error", message, "error");
    }

    dispatch(failure(message));
};