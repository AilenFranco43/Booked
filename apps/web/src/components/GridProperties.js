import { CardProperty } from "./CardProperty";

export const GridProperties = ({ properties }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 sm:px-2 py-6">
      {properties?.map(property => (
        <CardProperty key={property.id} property={property} />
      ))}
    </div>
  )
}