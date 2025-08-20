import { prospectingStatuses } from "../page";

export const getStatusInfo = (status: string) => {
  return (
    prospectingStatuses.find((s) => s.id === status) || prospectingStatuses[0]
  );
};
