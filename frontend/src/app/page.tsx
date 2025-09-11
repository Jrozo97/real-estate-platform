import SearchFilters from "@/components/SearchFilters/SearchFilters";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-semibold text-black">Real estate</h1>
      <div className="w-full h-full px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-20 lg:py-12">
        <SearchFilters />

      </div>
    </div>
  );
}
