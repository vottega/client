import { useCallback, useState } from "react";

export const useVoteDialog = () => {
  const [open, setOpen] = useState(false);
  const closeDialog = useCallback(() => setOpen(false), []);

  const onFail = useCallback(() => {}, []);
  const onSuccess = useCallback(() => {
    closeDialog();
  }, [closeDialog]);

  return { open, setOpen, onFail, onSuccess };
};
