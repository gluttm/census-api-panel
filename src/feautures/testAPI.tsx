import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface Res {
    ip: string
}

export const testAPI = createApi({
    reducerPath: 'testAPI',
    baseQuery: fetchBaseQuery({ baseUrl: "http://ip.jsontest.com"}),
    endpoints: (builder) => ({
        getIp: builder.query<Res, string>({
            query: () => `/`
        })
    }),
    
})

export const { useGetIpQuery } = testAPI