import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AppDispatch, RootState } from "../../../../ApplicationState/Store";
import Swal from "sweetalert2";

const initialState = {
    productions: [],
    production: {
        "id": "",
        "job_id": "",
        "product_name": "",
        "status": "",
        "order_id": "",
        "quantity": "",
        "stage": "",
        "assigned_to": "",
        "created_at": "",
        "updated_at": "",
        "started_at": "",
        "completed_at": "",
        "customer_name": "",
        "assigned_to_name": ""
    },
    loading: false,
    error: null,
};

const SalesProduction = createSlice({
    name: "SalesProduction",
    initialState,
    reducers: {
        getSalesProductionRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        getSalesProductionSuccess: (state, action) => {
            state.loading = false;
            state.productions = action.payload?.data || null;
            state.error = null;
        },

        getSalesSingleProductionSuccess: (state, action) => {
            state.loading = false;
            state.production = action.payload?.data || null;
            state.error = null;
        },

        getSalesProductionFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // state.production: {
            //     "id": "",
            //     "job_id": "",
            //     "product_name": "",
            //     "status": "",
            //     "order_id": "",
            //     "quantity": "",
            //     "stage": "",
            //     "assigned_to": "",
            //     "created_at": "",
            //     "updated_at": "",
            //     "started_at": "",
            //     "completed_at": "",
            //     "customer_name": "",
            //     "assigned_to_name": ""
            // };
        },

        clearSalesErrors: (state) => {
            state.error = null;
        },
    },
});

export const {
    getSalesProductionRequest,
    getSalesProductionSuccess,
    getSalesSingleProductionSuccess,
    getSalesProductionFailure,
    clearSalesErrors,
} = SalesProduction.actions;

export default SalesProduction.reducer;

// GET production's THUNK
export const getProductions = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(getSalesProductionRequest());
    try {
        Swal.fire({
            title: "Loading Productions...",
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
            `${import.meta.env.VITE_API_BASE_URL}/sales/production/jobs`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Opportunities response data:", data);
        // SUCCESS
        dispatch(getSalesProductionSuccess(data));
        console.log("Productions data after getProductions:", data);
        Swal.close();
    } catch (error: any) {
        Swal.close();

        const status = error.response?.status;
        const message =
            error.response?.data?.message || "Something went wrong";

        switch (status) {
            case 400:
                dispatch(getSalesProductionFailure(message || "Invalid request"));
                break;

            case 401: // invalid token or not logged in
                dispatch(getSalesProductionFailure(message || "Please provide a valid token"));
                break;

            case 403: // role mismatch or insufficient permissions
                dispatch(getSalesProductionFailure(message || "Unauthorized access"));
                break;

            case 404:
                dispatch(getSalesProductionFailure(message || "No Sales Orders found"));
                break;

            case 409: //optional (not needed here)
                dispatch(getSalesProductionFailure(message || "Conflict error"));
                break;

            case 500:
                dispatch(getSalesProductionFailure("Server error"));
                break;

            default:
                dispatch(getSalesProductionFailure(message));
        }
    }
};

// GET PRODUCTION THUNK
export const getProduction = (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(getSalesProductionRequest());
    try {
        Swal.fire({
            title: "Loading Production Details...",
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
            `${import.meta.env.VITE_API_BASE_URL}/sales/production/jobs/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Productions response data:", data);
        // SUCCESS
        dispatch(getSalesSingleProductionSuccess(data));
        console.log("Productions data after getProductions:", data);
        Swal.close();
    } catch (error: any) {
        Swal.close();
        const status = error.response?.status;
        const message =
            error.response?.data?.message || "Something went wrong";

        switch (status) {
            case 400:
                dispatch(getSalesProductionFailure(message || "Invalid request"));
                break;

            case 401: // invalid token or not logged in
                dispatch(getSalesProductionFailure(message || "Please provide a valid token"));
                break;

            case 403: // role mismatch or insufficient permissions
                dispatch(getSalesProductionFailure(message || "Unauthorized access"));
                break;

            case 404:
                dispatch(getSalesProductionFailure(message || "No Sales Orders found"));
                break;

            case 409: //optional (not needed here)
                dispatch(getSalesProductionFailure(message || "Conflict error"));
                break;

            case 500:
                dispatch(getSalesProductionFailure("Server error"));
                break;

            default:
                dispatch(getSalesProductionFailure(message));
        }
    }
};