import PropertyDetailClient from '@/modules/properties/components/PropertyDetail/PropertyDetail';
import React from 'react'


interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <PropertyDetailClient id={id} />
  )
}

export default page