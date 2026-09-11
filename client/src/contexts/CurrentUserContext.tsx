import { createContext } from 'react';
import type { CurrentUserContextType } from '../types/types';

const CurrentUserContext = createContext<CurrentUserContextType>({} as CurrentUserContextType);

export default CurrentUserContext;

