import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../components/modules/sales/ModuleStateFiles/AuthSlice";
import salesEmployeeReducer from "../components/modules/sales/ModuleStateFiles/EmployeeSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        SalesEmployee: salesEmployeeReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;