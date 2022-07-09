import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseApiUrl } from 'src/configs'
import { Census, CensusDeleteResponse, CensusPage } from 'src/types/Census'
import { RootState } from 'src/app/store'

const path: string = 'census'

export const censusService = createApi({
    reducerPath: 'censusService',
    tagTypes: ['census'],
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
        getCensu: builder.query<CensusPage, CensusPage>({
            query: (page: CensusPage) => ({
                url: `/${path}/?page=${page.number}&size=${page.size}`,
            }),
            providesTags: ['census']
        }),
        getCensus: builder.mutation<Census, number>({
            query: (id: number) => ({
                url: `/${path}/${id}`,
                method: 'GET'
            })
        }),
        saveCensus: builder.mutation<Census, Census>({
            query: (census: Census) => ({
                url: `/${path}`,
                method: 'POST',
                body: census
            }),
            invalidatesTags: ['census']
        }),
        updateCensus: builder.mutation<Census, Partial<Census>>({
            query: (data: Census) => ({
                url: `/${path}/${data.id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['census']
        }),
        deleteCensus: builder.mutation<CensusDeleteResponse, number>({
            query: (id: number) => ({
                url: `/${path}/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['census']
        })
    }),
})

export const {
    useGetCensuQuery,
    useSaveCensusMutation,
    useDeleteCensusMutation,
    useGetCensusMutation,
    useUpdateCensusMutation
} = censusService