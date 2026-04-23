export const calculateSequenceNumber = (
  pageIndex: number,
  pageSize: number,
  index: number
) => {
  return (pageIndex - 1) * pageSize + index + 1;
};
