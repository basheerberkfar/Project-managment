interface TableEmptyProps {
  message: string;
  colSpan: number;
}

export function TableEmpty({ message, colSpan }: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="py-12 text-center text-[var(--color-gray-dark-400)] h-64 align-middle"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-lg font-medium opacity-60">{message}</span>
        </div>
      </td>
    </tr>
  );
}
