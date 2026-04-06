import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AppDispatch, RootState } from "../../../../ApplicationState/Store";
import Swal from "sweetalert2";

const initialState = {
    // for sales pipeline chart
    pipeline: [],
    // recent leads
    recentLeads:[],
    // for product vs target chart
    salesByCategory: [],
    //new add here for dashboard stats
    dashboardStats: {
        totalLeads: 0,
        dealsWon: 0,
        revenue: 0,
        winRate: 0,
    },

    loading: false,
    error: "",
};

const dashboardSlice = createSlice({
    name: "SalesDashboard",
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
        getSuccess: (state, action) => {
            state.loading = false;
            state.salesByCategory = action.payload?.data?.salesByCategory || action.payload;
            state.pipeline = action.payload?.data?.pipeline || action.payload;
            state.recentLeads = action.payload?.data?.recentLeads || action.payload;
        },
    },
});

export const {
    request,
    failure,
    clearErrors,
    getSuccess,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

// GET ALL LEADS
export const getDashboardData =
    () => async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(request());
        Swal.fire({
            title: "Loading Dashboard Data...",
            text: "Please wait while we fetch the data.",
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
                `${import.meta.env.VITE_API_BASE_URL}/sales/dashboard`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            dispatch(getSuccess(data));
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