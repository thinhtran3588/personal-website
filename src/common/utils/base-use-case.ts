export type UseCaseResult<TData, TError> =
  | { success: true; data: TData }
  | { success: false; error: TError };

export type EmptyInput = Record<string, never>;

export abstract class BaseUseCase {
  abstract execute(input: unknown): Promise<unknown>;

  protected async handle<TData, TError>(
    action: () => Promise<TData>,
    mapError?: (err: unknown) => TError,
  ): Promise<UseCaseResult<TData, TError>> {
    try {
      const data = await action();
      return { success: true, data };
    } catch (err) {
      console.error(err);
      const error = mapError !== undefined ? mapError(err) : (err as TError);
      return { success: false, error };
    }
  }
}
