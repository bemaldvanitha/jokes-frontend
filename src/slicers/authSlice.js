import { apiSlice } from "@/slicers/apiSlice";

import { MODERATE_JOKES_URL } from "@/configuration";

export const authSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: `${MODERATE_JOKES_URL}/auth/login`,
                body: body,
                method: 'POST'
            })
        })
    })
});

export const { useLoginMutation } = authSlice;