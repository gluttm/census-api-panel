import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import reservationReducer from '../feautures/reservationSlice';
import authSlice from '../feautures/authSlice';
import { userService } from '../feautures/services/userService';
import { roleService } from 'src/feautures/services/roleService';
import { permissionService } from 'src/feautures/services/permissionService';
import { districtService } from 'src/feautures/services/districtService';
import { censusService } from 'src/feautures/services/censusService';


export const store = configureStore({
  reducer: {
    auth: authSlice,
    reservations: reservationReducer,
    [userService.reducerPath]: userService.reducer,
    [permissionService.reducerPath]: permissionService.reducer,
    [roleService.reducerPath]: roleService.reducer,
    [districtService.reducerPath]: districtService.reducer,
    [censusService.reducerPath]: censusService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(roleService.middleware)
                          .concat(permissionService.middleware)
                          .concat(userService.middleware)
                          .concat(districtService.middleware)
                          .concat(censusService.middleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
