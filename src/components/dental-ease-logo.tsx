import { Link } from '@tanstack/react-router';

const DentalEaseLogo = () => {
  return (
    <div className="hidden w-full md:block">
      <div className="flex text-center">
        <Link
          to="/"
          className="flex h-9 cursor-pointer items-center justify-center rounded bg-linear-to-r from-primary-blue via-primary-blue to-sky-500 p-5 py-0 text-white hover:saturate-150"
        >
          <h1 className="font-bold text-lg">Dental</h1>
          <h4 className="font-light text-lg">Ease</h4>
        </Link>
      </div>
    </div>
  );
};

export default DentalEaseLogo;
