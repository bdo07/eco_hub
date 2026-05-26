export const getAdminLogoutUrl = () => {
  return `/api/admin/logout`
}

/**
 * @summary Admin logout
 */
export const adminLogout = async ( options?: RequestInit): Promise<LogoutResponse> => {
  return customFetch<LogoutResponse>(getAdminLogoutUrl(),
  {
    ...options,
    method: 'POST',
  }
);}

export const getAdminLogoutMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError,{}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError,{}, TContext> => {

const mutationKey = ['adminLogout'];
const {mutation: mutationOptions, request: requestOptions} = options ?
    options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
    options
    : {...options, mutation: {...options.mutation, mutationKey}}
    : {mutation: { mutationKey, }, request: undefined};

    const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminLogout>>, {}> = (props) => {
        return  adminLogout(options)
      }

    return  { mutationFn, ...mutationOptions }}

    export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>
    export type AdminLogoutMutationError = ErrorType<unknown>

/**
 * @summary Admin logout
 */
export const useAdminLogout = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError,{}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationResult<
    Awaited<ReturnType<typeof adminLogout>>,
    TError,
    {},
    TContext
    > => {
    return useMutation(getAdminLogoutMutationOptions(options));
}