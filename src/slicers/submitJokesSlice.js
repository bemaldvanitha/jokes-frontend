import { apiSlice } from "@/slicers/apiSlice";

import { SUBMIT_JOKES_URL } from "@/configuration";

export const submitJokesSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        submitJoke: builder.mutation({
            query: (body) => ({
                url: `${SUBMIT_JOKES_URL}/joke`,
                method: 'POST',
                body: body
            })
        })
    })
});

export const { useSubmitJokeMutation } = submitJokesSlice;