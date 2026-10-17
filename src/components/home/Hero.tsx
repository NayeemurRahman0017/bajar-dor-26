
import Image from "next/image";
import logo from "@/assets/bazar-hero.png";

export default function Hero() {
return ( <section className="bg-[#F0F5F0] px-4 py-8 sm:px-6"> <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 rounded-[28px] bg-[#FCFDFC] px-5 py-8 sm:px-8 md:min-h-75 md:grid-cols-[1.6fr_0.8fr] md:px-5 md:py-6 lg:px-6"> <div className="text-center md:text-left"> <p className="mb-3 inline-block rounded-full bg-[#E1F2E7] px-3 py-1 text-xs font-medium text-[#43865D] sm:text-sm">
শনিবার, ১৭ অক্টোবর, ২০২৬ </p>

      <h1 className="mb-4 text-2xl font-bold leading-tight text-[#171717] sm:text-3xl lg:text-4xl">
        আজকের বাজারের দাম এক নজরে
      </h1>

      <p className="mb-6 max-w-155 text-sm leading-6 text-[#777777] sm:text-base sm:leading-7">
        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
        বাজারভিত্তিক বিশ্লেষণ, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
        দামের পরিবর্তন এক জায়গায়।
      </p>

      <a
        href="#সব-পণ্য"
        className="inline-flex items-center justify-center rounded-lg bg-[#078A4B] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#06733F]"
      >
        সব পণ্যের দাম দেখুন
      </a>
    </div>

    <div className="flex items-center justify-center md:justify-end">
      <Image
        src={logo}
        alt="BazarDor বাজারের ছবি"
        priority
        className="h-auto w-48 object-contain sm:w-56 md:w-full md:max-w-70"
      />
    </div>
  </div>
</section>


);
}
