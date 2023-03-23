import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const cryptoNewsHeaders = {
    'x-bingapis-sdk': 'true',
    'x-rapidapi-host': process.env.REACT_APP_RAPID_NEWS_HOST,
    'x-rapidapi-key': process.env.REACT_APP_RAPID_NEWS_API
};
const createRequest = (url) => ({url, headers: cryptoNewsHeaders});
const baseUrl = 'https://bing-news-search1.p.rapidapi.com'

export const cryptoNewsApi = createApi({
    ReducerPath: 'cryptoNewsApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getCryptoNews: builder.query({
            query: () => createRequest(
                '/news/search?q=cryptocurrency&safeSearch=Off&textFormat=Raw&freshness=Day&coun=12'),
        }),
    })
})


export const {
    useGetCryptoNewsQuery,
} = cryptoNewsApi;

