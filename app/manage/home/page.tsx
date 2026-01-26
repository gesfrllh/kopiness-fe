'use client'

import { Homepage } from "@/components/Home/HomePage";
import React from "react";
import UseLenis from "@/lib/lenis";

const page = () => {
  return (
    <>
    <UseLenis />
      <Homepage />
    </>);
}

export default page;