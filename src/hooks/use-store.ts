import { useEffect, useLayoutEffect, useState } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const useStore = <T, F>(store: (callback: (state: T) => unknown) => unknown, callback: (state: T) => F) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>(result);

  useIsomorphicLayoutEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
