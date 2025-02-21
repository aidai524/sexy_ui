import React from 'react';
import { Memes } from '@/app/sections/memes/hooks';

export const MemesContext = React.createContext<Partial<Memes>>({});
