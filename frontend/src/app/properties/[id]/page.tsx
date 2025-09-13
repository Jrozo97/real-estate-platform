import PropertyDetailClient from '@/modules/properties/components/PropertyDetail/PropertyDetail';
import React from 'react'


type Props = { params: { id: string } };

const page = ({ params }: Props) => {
  return (
    <PropertyDetailClient id={params.id} />
  )
}

export default page