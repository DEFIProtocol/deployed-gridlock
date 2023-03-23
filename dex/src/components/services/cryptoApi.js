import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cryptoApiHeaders = {
    'x-rapidapi-host': process.env.REACT_APP_RAPID_API_HOST,
    'x-rapidapi-key': process.env.REACT_APP_API_KEY
};
const createRequest = (url) => ({url, headers: cryptoApiHeaders});
const baseUrl = ('https://coinranking1.p.rapidapi.com')

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getCryptos: builder.query({
            query: (count) => createRequest( 
                `/coins?limit=${count}`)
            }),
        getCryptoDetails: builder.query({
            query: (coinId) => createRequest(`/coin/${coinId}`)
        }),
        getCryptoHistory: builder.query({
            query: ({ coinId, timePeriod }) => createRequest(`coin/${coinId}/history?timePeriod=${timePeriod}`),
        })
        }),
    })


export const {
    useGetCryptosQuery,
    useGetCryptoDetailsQuery,
    useGetCryptoHistoryQuery,
} = cryptoApi;

