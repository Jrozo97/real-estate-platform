import PropertyClient from "@/modules/properties/components/PropertyClient/PropertyClient";

export default async function Home() {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-semibold text-blue-950">Inmobiliaria XYZ</h1>
      <div className="w-full h-full py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-20 lg:py-12">
        <PropertyClient />

      </div>
    </div>
  );
}
