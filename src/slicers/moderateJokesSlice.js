import { apiSlice } from "@/slicers/apiSlice";

import { MODERATE_JOKES_URL } from "@/configuration";

const getToken = () => localStorage.getItem('token');

export const moderateJokesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNonModeratedJoke: builder.query({
            query: () => ({
                url: `${MODERATE_JOKES_URL}/non-moderate`,
                headers: {
                    'x-auth-token': getToken()
                }
            }),
            keepUnusedDataFor: 5
        }),
        acceptJoke: builder.mutation({
            query: ({ id, body }) => ({
                url: `${MODERATE_JOKES_URL}/accept/${id}`,
                method: 'PATCH',
                body: body,
                headers: {
                    'x-auth-token': getToken()
                }
            })
        }),
        rejectJoke: builder.mutation({
            query: (id) => ({
                url: `${MODERATE_JOKES_URL}/reject/${id}`,
                method: 'PATCH',
                headers: {
                    'x-auth-token': getToken()
                }
            })
        }),
        deleteJoke: builder.mutation({
            query: (id) => ({
                url: `${MODERATE_JOKES_URL}/delete/${id}`,
                method: 'DELETE',
                headers: {
                    'x-auth-token': getToken()
                }
            })
        })
    })
});

export const { useGetNonModeratedJokeQuery, useAcceptJokeMutation, useRejectJokeMutation,
    useDeleteJokeMutation } = moderateJokesSlice;