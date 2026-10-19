"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/assets/bazar-hero.png";

export default function Hero() {
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    function updateBanglaDate() {
      const currentDate = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date());

      setBanglaDate(currentDate);
    }

    updateBanglaDate();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <section className="bg-[#F0F5F0] px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 rounded-[28px] bg-[#FCFDFC] px-5 py-8 sm:px-8 md:min-h-75 md:grid-cols-[1.6fr_0.8fr] md:px-5 md:py-6 lg:px-6">
          <div className="text-center md:text-left">
            <p className="mb-2 text-sm text-[#777777]">
              {banglaDate || "\u00A0"}
            </p>

            <h1 className="mb-4 text-2xl font-bold leading-tight text-[#171717] sm:text-3xl lg:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mb-6 max-w-155 text-sm leading-6 text-[#777777] sm:text-base sm:leading-7">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিশ্লেষণ, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
              দামের পরিবর্তন এক জায়গায়।
            </p>

            <a
              href="#all-products"
              className="inline-flex items-center justify-center rounded-lg bg-[#078A4B] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#06733F] focus:outline-none focus:ring-2 focus:ring-[#078A4B] focus:ring-offset-2"
            >
              সব পণ্য দেখুন
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
    </div>
  );
}