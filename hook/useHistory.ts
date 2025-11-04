import { useCallback, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Options for history manipulation
 */
interface HistoryOptions {
  /**
   * Custom path to navigate to
   * If not provided, uses current pathname
   */
  pathName?: string;

  /**
   * Query parameters to add/update
   */
  params?: Record<string, string | number | boolean | null | undefined>;

  /**
   * Scroll to top of the page after navigation
   * @default true
   */
  scroll?: boolean;

  /**
   * Replace current history entry instead of adding a new one
   * @default false
   */
  replace?: boolean;
}

/**
 * Custom hook for advanced URL navigation and query parameter manipulation
 */
export function useHistory() {
  const router = useRouter();
  const currentPathName = usePathname();
  const searchParams = useSearchParams();

  /**
   * Create a new URLSearchParams instance from current params
   */
  const createSearchParams = useCallback(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  /**
   * Construct URL with given pathname and parameters
   */
  const constructUrl = useCallback(
    (
      pathname: string,
      params?: Record<string, string | number | boolean | null | undefined>
    ): string => {
      const searchParamsInstance = new URLSearchParams();

      // Add parameters to search params
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            searchParamsInstance.delete(key);
          } else {
            searchParamsInstance.set(key, String(value));
          }
        });
      }

      // Construct URL
      const searchString = searchParamsInstance.toString();
      return searchString
        ? (`${pathname}?${searchString}` as string)
        : pathname;
    },
    []
  );

  /**
   * Push new navigation state
   */
  const push = useCallback(
    (options: HistoryOptions = {}) => {
      const {
        pathName = currentPathName,
        params,
        scroll = true,
        replace = false,
      } = options;

      const url: any = constructUrl(pathName, params);

      // Navigate with appropriate method
      if (replace) {
        router.replace(url, { scroll });
      } else {
        router.push(url, { scroll });
      }
    },
    [router, currentPathName, constructUrl]
  );

  /**
   * Replace current navigation state
   */
  const replace = useCallback(
    (options: HistoryOptions = {}) => {
      push({ ...options, replace: true });
    },
    [push]
  );

  /**
   * Reset parameters for current or specified path
   */
  const reset = useCallback(
    (
      options: Omit<HistoryOptions, 'params'> & {
        keys?: string[];
      } = {}
    ) => {
      const { pathName = currentPathName, scroll = true, keys } = options;

      const currentParams = createSearchParams();

      if (keys) {
        // Remove specific keys
        keys.forEach((key) => currentParams.delete(key));
      } else {
        // Clear all parameters
        currentParams.forEach((_, key) => currentParams.delete(key));
      }

      const searchString = currentParams.toString();
      const url: any = searchString ? `${pathName}?${searchString}` : pathName;

      router.replace(url, { scroll });
    },
    [router, currentPathName, createSearchParams]
  );

  return useMemo(
    () => ({
      push,
      replace,
      reset,
    }),
    [push, replace, reset]
  );
}
