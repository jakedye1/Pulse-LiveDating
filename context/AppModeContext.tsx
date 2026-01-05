import createContextHook from '@nkzw/create-context-hook';
import { useState } from 'react';

export type AppMode = 'dating' | 'groups' | 'friends';

export const [AppModeProvider, useAppMode] = createContextHook(
  () => {
    const [mode, setMode] = useState<AppMode>('dating');

    return {
      mode,
      setMode,
    };
  },
  {
    mode: 'dating' as AppMode,
    setMode: () => {},
  }
);
