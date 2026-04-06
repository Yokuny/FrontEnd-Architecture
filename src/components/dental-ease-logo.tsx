import { Link } from '@tanstack/react-router';

const DentalEaseLogo = () => {
  return (
    <Link to="/" className="flex cursor-pointer">
      <h1 className="font-bold text-lg">Dental</h1>
      <h4 className="font-light text-lg">Ease</h4>
    </Link>
  );
};

export default DentalEaseLogo;
