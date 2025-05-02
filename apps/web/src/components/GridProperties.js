import { CardProperty } from "./CardProperty"

export const GridProperties = ({ properties }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4">
      {properties?.map(property => <CardProperty key={property.id} property={property}/>)}
    </div>
  )
}
