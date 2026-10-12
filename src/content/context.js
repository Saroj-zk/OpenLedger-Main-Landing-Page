import { createContext, useContext } from 'react';

export const CopyContext = createContext(null);

/** The copy variation on screen: { version, setVersion, copy }. */
export function useCopy() {
  return useContext(CopyContext);
}
