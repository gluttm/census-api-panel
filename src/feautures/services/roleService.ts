import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseApiUrl } from 'src/configs'
import { Role, RoleDeleteResponse, RolePage } from 'src/types/Role'
import { RootState } from 'src/app/store'

const path: string = 'roles'

export const roleService = createApi({
    reducerPath: 'roleService',
    tagTypes: ['roles'],
    baseQuery: fetchBaseQuery({
        baseUrl: baseApiUrl,
        prepareHeaders: (headers, { getState, endpoint }) => {
            const accessToken = (getState() as RootState).auth.accessToken
            headers.set('Authorization', `Bearer ${accessToken}`)
            headers.set('Content-Type', 'application/json')
            return headers
        }
    }),
    endpoints: (builder) => ({
        getRoles: builder.query<RolePage, RolePage>({
            query: (page: RolePage) => ({
                url: `/${path}/?page=${page.number}&size=${page.size}`,
            }),
            providesTags: ['roles']
        }),
        getRole: builder.mutation<Role, number>({
            query: (id: number) => ({
                url: `/${path}/${id}`,
                method: 'GET'
            })
        }),
        saveRole: builder.mutation<Role, Role>({
            query: (role: Role) => ({
                url: `/${path}`,
                method: 'POST',
                body: role
            }),
            invalidatesTags: ['roles']
        }),
        updateRole: builder.mutation<Role, Partial<Role>>({
            query: (data: Role) => ({
                url: `/${path}/${data.id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['roles']
        }),
        deleteRole: builder.mutation<RoleDeleteResponse, number>({
            query: (id: number) => ({
                url: `/${path}/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['roles']
        })
    }),
})

export const {
    useGetRolesQuery,
    useSaveRoleMutation,
    useDeleteRoleMutation,
    useGetRoleMutation,
    useUpdateRoleMutation
} = roleService