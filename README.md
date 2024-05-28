# REACT QUERY APP

    A learning App of React Query/ TanStack Query library - from Academind course.

### Pros:

1. To use React query hooks we have to add `QueryClientProvider` at the top level of the component and pass client prop value of `queryClient` is initiated from `QueryClient` class from the library
2. It will triggers API when we switch to new tab and back to the app tab.
3. When we navigate to other route and back to the dashboard, the data will display quick which shows the cached data, in behind the scene it will triggers the API anf fetch the new data and updates in silent.
4. We set a `queryKey` as the API unique identifier to cache the API data, it is an array of multi combinations of values. We send static values if no dynamic values attached to the API, if have any we can add the dynamic values in `key-value` pairs in the array.
5. `staleTime` - used to hold the new API trigger. by default - `0` so when we back to dashboard it will triggers the API, if i set to `5000`, then navigate to new page and back to dashboard within `5000ms` then it will not trigger the API
6. `gcTime(garbage collection time)` - cache storage time - default - 5min
7. We can use `signal` property from the `queryFn` in `useQuery` to terminate the existing API call in the fly if value is True.
8. `enabled` - used to disable API call on condition based by setting - False
9. We can use `useMutate` hook and pass function to `mutationFn` for post calls, as it will be triggered based on user action unlike `useQuery` triggered on load on conditions
10. If we have an use case of execution any statements after the mutate completion, we can pass `onSuccess` callback to `useMutate`.
11. If any data that has to be fetched after the mutation, we can use the `queryClient` inside the `onSuccess` callback to re-trigger all the API's using `useQuery` by using `queryClient.invalidateQueries({ queryKey: [keys] })`. This will re-triggers all the API's containing `keys` in the `queryKey` list. If we need to re-trigger only the API's that has the match, the we can pass `exact: true` in the `queryClient.invalidateQueries({ queryKey: [keys], exact: true })`
12. Edit functionality - added comments in EditEvent.jsx file in components/Events
