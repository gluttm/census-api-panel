import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "src/app/store";
import { baseApiUrl } from "src/configs";
import { LoginResponse, User, UserDeleteResponse, UserPage } from "src/types/User";
import { Login } from "../../types/Login";

const path: string = 'users'

export const userService = createApi({
    reducerPath: 'userService',
    tagTypes: ['user'],
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
        getUsers: builder.query<UserPage, UserPage>({
            query: (page: UserPage) => ({
                url: `/${path}/?page=${page.number}&size=${page.size}`,
            }),
            providesTags: ['user']
        }),
        signIn: builder.mutation<LoginResponse, Login>({
            query: (login) => ({
                url: 'login',
                method: 'POST',
                body: login
            })
        }),
        getUser: builder.mutation<User, number>({
            query: (id: number) => ({
                url: `/${path}/${id}`,
                method: 'GET'
            })
        }),
        saveUser: builder.mutation<User, User>({
            query: (user: User) => ({
                url: `/${path}`,
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['user']
        }),
        updateUser: builder.mutation<User, Partial<User>>({
            query: (data: User) => ({
                url: `/${path}/${data.id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['user']
        }),
        deleteUser: builder.mutation<UserDeleteResponse, number>({
            query: (id: number) => ({
                url: `/${path}/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['user']
        })
    })
})

export const {
    useSignInMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserMutation,
    useSaveUserMutation,
    useUpdateUserMutation
} = userService