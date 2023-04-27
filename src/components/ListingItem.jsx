import React from 'react'

const ListingItem = ({listing, id}) => {
  return (
    <div><p>{listing.name} {id}
        </p></div>
  )
}

export default ListingItem