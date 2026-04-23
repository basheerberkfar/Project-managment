import { RingLoader } from 'react-spinners';
import { useUIStore } from '@/store/ui.store';

const Loader: React.FC = () => {
  const theme = useUIStore((s) => s.theme);
  const spinnerColor = theme === 'dark' ? '#4fa3a0' : '#3f6d6a';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#161f1e]">
      <div
        className="flex gap-2 items-center justify-center"
        aria-label="Loading"
      >
        <RingLoader size={40} color={spinnerColor} />
      </div>
    </div>
  );
};

export default Loader;
