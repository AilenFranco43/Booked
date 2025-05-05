import Image from "next/image";
import Link from "next/link";

export const CardProperty = ({ property }) => {
  const {
    title,
    description,
    price,
    photos,
    tags,
    createdAt,
    updatedAt,
    id,
    max_people,
  } = property;

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const photoUrl =
    photos.length > 0
      ? photos[0]
      : "https://agentrealestateschools.com/wp-content/uploads/2021/11/real-estate-property.jpg";

  return (
    <div className="border-2 border-[#5FA77780] rounded-2xl overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:cursor-pointer">
      <Link href={`/property/detail/${property?.id}`}>
        <Image
          src={photoUrl}
          width={300}
          height={300}
          alt={`Photo of property`}
          className="object-cover w-full h-auto"
        />
          <div className="w-full p-2 flex flex-wrap gap-1">
            {tags &&
              tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-[rgba(95,167,119,.6)] text-white text-xs font-semibold px-2 py-1 rounded-full "
                >
                  {tag}
                </span>
              ))}
          </div>

        <div className="p-4 pt-0">
          <h3 className="font-roboto font-bold capitalize">{title}</h3>
          <div>
            <p className="font-roboto text-sm text-gray-700 mt-2">
              {truncateText(description, 100)}{" "}
              {/* ajustá el número a tu preferencia */}
            </p>
          </div>


          <div className="ml-1 py-2">
            <p className="font-roboto text-sm font-bold text-slate-600">
              {" "}
              Capacidad: {max_people} personas
            </p>

            <p className="font-roboto font-bold pt-1">
              <span className="text-[#5FA777]">${price}</span>
              <span className="text-black">/noche</span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
