import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from "src/app/store";
import { baseApiUrl } from "src/configs";
import { Permission } from "src/types/Permission";

export const permissionService = createApi({
    reducerPath: 'permissionService',
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.accessToken;
            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getPermissions: builder.query<Permission[], void>({
            query: () => `/permissions`
        })
    })

})

export const { useGetPermissionsQuery } = permissionService