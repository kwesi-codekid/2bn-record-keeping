import { Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";

interface PackageCardProps {
  packageId: string;
  title: string;
  bannerImage: string;
}

const PackageCard = ({ packageId, title, bannerImage }: PackageCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl p-4 flex flex-col gap-2 bg-gradient-to-br from-blue-500/10 to-indigo-700/20 h-max">
      <div className="rounded-xl overflow-hidden">
        <img
          className="w-full h-52 hover:scale-105 transition-all duration-400 ease-in-out object-cover rounded-xl"
          src={bannerImage}
          alt={title}
        />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="flex items-center gap-2">
        <Button
          color="success"
          variant="flat"
          className="font-montserrat font-semibold"
          size="sm"
          onPress={() => navigate(`/admin/packages/${packageId}`)}
        >
          View
        </Button>
        <Button
          color="primary"
          variant="flat"
          className="font-montserrat font-semibold"
          size="sm"
        >
          Edit
        </Button>
        <Button
          color="danger"
          variant="flat"
          className="font-montserrat font-semibold"
          size="sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default PackageCard;
