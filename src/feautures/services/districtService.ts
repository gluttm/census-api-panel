import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseApiUrl } from 'src/configs'
import { District, DistrictDeleteResponse } from 'src/types/District'
import { RootState } from 'src/app/store'

const path: string = 'districts'

export const districtService = createApi({
    reducerPath: 'districtService',
    tagTypes: ['districts'],
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
        getDistricts: builder.query<District[], void>({
            query: () => ({
                url: `/${path}`,
            }),
            providesTags: ['districts']
        }),
        getFilteredDistricts: builder.query<District[], string>({
            query: (name) => ({
                url: `/${path}/filter/?name=${name}`,
            }),
            providesTags: ['districts']
        }),
        getDistrict: builder.mutation<District, number>({
            query: (id: number) => ({
                url: `/${path}/${id}`,
                method: 'GET'
            })
        }),
        saveDistricts: builder.mutation<District, District>({
            query: (districts: District) => ({
                url: `/${path}`,
                method: 'POST',
                body: districts
            }),
            invalidatesTags: ['districts']
        }),
        updateDistricts: builder.mutation<District, Partial<District>>({
            query: (data: District) => ({
                url: `/${path}/${data.id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['districts']
        }),
        deleteDistrict: builder.mutation<DistrictDeleteResponse, number>({
            query: (id: number) => ({
                url: `/${path}/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['districts']
        })
    }),
})

export const {
    useGetDistrictsQuery,
    useSaveDistrictsMutation,
    useDeleteDistrictMutation,
    useGetDistrictMutation,
    useUpdateDistrictsMutation,
    useGetFilteredDistrictsQuery
} = districtService 