"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { CustomIcon } from "../icon/icon";

export const YoumindCard = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full border-2 border-gray-300 rounded-md px-[36px] py-[24px] sm:py-[20px] ">
      <h1 className="text-[16px] text-gray-600 sm:text-xl font-medium text-center mt-4">
        我们通过推文了解你，
        <br />
        你，可以通过写作认识你自己。
        <br />
        来YouMind，写一段只属于你的文字。
      </h1>
      <Image
        src="/images/youmindCardTest.JPG"
        alt="YouMind Card"
        width={100}
        height={100}
      />

      <Button className="w-1/3 mt-4 mb-8 rounded-full h-12">
        <CustomIcon className="h-4 w-4" />
        <Link href="https://youmind.ai/overview" target="_blank">
          <p>开始写作</p>
        </Link>
      </Button>
    </div>
  );
};
