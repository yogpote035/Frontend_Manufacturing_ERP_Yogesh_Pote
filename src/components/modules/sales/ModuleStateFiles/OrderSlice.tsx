import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AppDispatch, RootState } from "../../../../ApplicationState/Store";
import Swal from "sweetalert2";

const initialState = {
    orders: [],
    order: {
        "id": "",
        "order_id": "",
        "customer_name": "",
        "total_amount": "",
        "quotation_id": "",
        "email": "",
        "phone": "",
        "shipping_address": "",
        "notes": "",
        "sales_rep_id": "",
        "status": "",
        "order_date": "",
        "created_at": "",
        "updated_at": "",
        "sales_rep_name": "",
        "items": [
            {
                "id": "",
                "order_id": "",
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

const SalesOrder = createSlice({
    name: "SalesOrder",
    initialState,
    reducers: {
        getSalesOrderRequest: (state) => {
            state.loading = true;
            state.error = null;
        },

        getSalesOrdersSuccess: (state, action) => {
            state.loading = false;
            state.orders = action.payload?.data || null;
            state.error = null;
        },

        getSalesSingleOrderSuccess: (state, action) => {
            state.loading = false;
            state.order = action.payload?.data || null;
            state.error = null;
        },

        getSalesOrderFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            // state.orders = [];
            // state.order =  {
            //     "id": "",
            //     "order_id": "",
            //     "customer_name": "",
            //     "total_amount": "",
            //     "quotation_id": "",
            //     "email": "",
            //     "phone": "",
            //     "shipping_address": "",
            //     "notes": "",
            //     "sales_rep_id": "",
            //     "status": "",
            //     "order_date": "",
            //     "created_at": "",
            //     "updated_at": "",
            //     "sales_rep_name": "",
            //     "items": [
            //         {
            //             "id": "",
            //             "order_id": "",
            //             "product_name": "",
            //             "quantity": "",
            //             "unit_price": "",
            //             "total_price": ""
            //         }
            //     ]
            // };
        },

        clearSalesErrors: (state) => {
            state.error = null;
        },
    },
});

export const {
    getSalesOrderRequest,
    getSalesOrdersSuccess,
    getSalesSingleOrderSuccess,
    getSalesOrderFailure,
    clearSalesErrors,
} = SalesOrder.actions;

export default SalesOrder.reducer;

// GET order's THUNK
export const getOrders = () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(getSalesOrderRequest());
    try {
        Swal.fire({
            title: "Loading Orders...",
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
            `${import.meta.env.VITE_API_BASE_URL}/sales/orders`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Opportunities response data:", data);
        // SUCCESS
        dispatch(getSalesOrdersSuccess(data));
        console.log("Opportunities data after getOpportunities:", data);
        Swal.close();
    } catch (error: any) {
        Swal.close();

        const status = error.response?.status;
        const message =
            error.response?.data?.message || "Something went wrong";

        switch (status) {
            case 400:
                dispatch(getSalesOrderFailure(message || "Invalid request"));
                break;

            case 401: // invalid token or not logged in
                dispatch(getSalesOrderFailure(message || "Please provide a valid token"));
                break;

            case 403: // role mismatch or insufficient permissions
                dispatch(getSalesOrderFailure(message || "Unauthorized access"));
                break;

            case 404:
                dispatch(getSalesOrderFailure(message || "No Sales Orders found"));
                break;

            case 409: //optional (not needed here)
                dispatch(getSalesOrderFailure(message || "Conflict error"));
                break;

            case 500:
                dispatch(getSalesOrderFailure("Server error"));
                break;

            default:
                dispatch(getSalesOrderFailure(message));
        }
    }
};

// GET ORDER THUNK
export const getOrder = (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(getSalesOrderRequest());
    try {
        Swal.fire({
            title: "Loading Order Details...",
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
            `${import.meta.env.VITE_API_BASE_URL}/sales/orders/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Opportunities response data:", data);
        // SUCCESS
        dispatch(getSalesSingleOrderSuccess(data));
        console.log("Opportunities data after getOpportunities:", data);
        Swal.close();
    } catch (error: any) {
        Swal.close();
        const status = error.response?.status;
        const message =
            error.response?.data?.message || "Something went wrong";

        switch (status) {
            case 400:
                dispatch(getSalesOrderFailure(message || "Invalid request"));
                break;

            case 401: // invalid token or not logged in
                dispatch(getSalesOrderFailure(message || "Please provide a valid token"));
                break;

            case 403: // role mismatch or insufficient permissions
                dispatch(getSalesOrderFailure(message || "Unauthorized access"));
                break;

            case 404:
                dispatch(getSalesOrderFailure(message || "No Sales Orders found"));
                break;

            case 409: //optional (not needed here)
                dispatch(getSalesOrderFailure(message || "Conflict error"));
                break;

            case 500:
                dispatch(getSalesOrderFailure("Server error"));
                break;

            default:
                dispatch(getSalesOrderFailure(message));
        }
    }
};