import React from 'react';
import { Airdrop } from '@/app/components/airdrop/hooks';

export const AirdropContext = React.createContext<Partial<Airdrop>>({});
