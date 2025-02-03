import { BarLoader } from 'react-spinners';

const Loadingbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <BarLoader color="#4F46E5" width="100%" height={4} />
    </div>
  );
};

export default Loadingbar;