import { fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "@/configuration";

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    tagTypes: [],
    endpoints: (builder) => ({

    })
});