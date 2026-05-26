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

/**
 * @summary Update a category (admin)
 */
export const updateCategory = async (id: number,
    categoryUpdate: CategoryUpdate, options?: RequestInit): Promise<Category> => {
    return customFetch<Category>(`/api/categories/${id}`,
    {
        ...options,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        body: JSON.stringify(
            categoryUpdate,)
    }
);}

export const getUpdateCategoryMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError,{id: number;data: BodyType<CategoryUpdate>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError,{id: number;data: BodyType<CategoryUpdate>}, TContext> => {

const mutationKey = ['updateCategory'];
const {mutation: mutationOptions, request: requestOptions} = options ?
    options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
    options
    : {...options, mutation: {...options.mutation, mutationKey}}
    : {mutation: { mutationKey, }, request: undefined};

    const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateCategory>>, {id: number;data: BodyType<CategoryUpdate>}> = (props) => {
        const {id,data} = props ?? {};
        return  updateCategory(id,data,requestOptions)
      }

    return  { mutationFn, ...mutationOptions }}

    export type UpdateCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof updateCategory>>>
    export type UpdateCategoryMutationBody = BodyType<CategoryUpdate>
    export type UpdateCategoryMutationError = ErrorType<unknown>

/**
 * @summary Update a category (admin)
 */
export const useUpdateCategory = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError,{id: number;data: BodyType<CategoryUpdate>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationResult<
    Awaited<ReturnType<typeof updateCategory>>,
    TError,
    {id: number;data: BodyType<CategoryUpdate>},
    TContext
    > => {
    return useMutation(getUpdateCategoryMutationOptions(options));
}

/**
 * @summary Delete a category (admin)
 */
export const deleteCategory = async (id: number, options?: RequestInit): Promise<void> => {
    return customFetch<void>(`/api/categories/${id}`,
    {
        ...options,
        method: 'DELETE'
    }
);}

export const getDeleteCategoryMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError,{id: number}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError,{id: number}, TContext> => {

const mutationKey = ['deleteCategory'];
const {mutation: mutationOptions, request: requestOptions} = options ?
    options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
    options
    : {...options, mutation: {...options.mutation, mutationKey}}
    : {mutation: { mutationKey, }, request: undefined};

    const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteCategory>>, {id: number}> = (props) => {
        const {id} = props ?? {};
        return  deleteCategory(id,requestOptions)
      }

    return  { mutationFn, ...mutationOptions }}

    export type DeleteCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCategory>>>
    export type DeleteCategoryMutationError = ErrorType<unknown>

/**
 * @summary Delete a category (admin)
 */
export const useDeleteCategory = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError,{id: number}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationResult<
    Awaited<ReturnType<typeof deleteCategory>>,
    TError,
    {id: number},
    TContext
    > => {
    return useMutation(getDeleteCategoryMutationOptions(options));
}