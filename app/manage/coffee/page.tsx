import Coffee from "@/components/coffee";
import LoaderTransition from "@/components/LoaderTransition";
import React from "react";

const page = () => {
  return (
    <>
    <LoaderTransition />
      <div>
        <Coffee />
      </div>
    </>
  )
}

export default page;