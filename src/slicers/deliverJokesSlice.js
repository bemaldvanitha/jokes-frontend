import { apiSlice } from "@/slicers/apiSlice";

import { DELIVER_JOKES_URL } from "@/configuration";

export const deliverJokesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRandomJokes: builder.query({
            query: () => ({
                url: `${DELIVER_JOKES_URL}/jokes/random`
            }),
            keepUnusedDataFor: 5
        }),
        getAllJokeTypes: builder.query({
            query: () => ({
                url: `${DELIVER_JOKES_URL}/jokes/types`
            }),
            keepUnusedDataFor: 5
        }),
        getRandomJokeByCategory: builder.query({
            query: (id) => ({
                url: `${DELIVER_JOKES_URL}/jokes/random/category/${id}`
            }),
            keepUnusedDataFor: 5
        })
    })
});

export const { useGetRandomJokesQuery, useGetAllJokeTypesQuery, useGetRandomJokeByCategoryQuery
        } = deliverJokesSlice;