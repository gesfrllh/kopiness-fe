import React from "react";
import History from "@/components/history";
import LoaderTransition from "@/components/LoaderTransition";

const page = () => {
  return (
    <>
      <LoaderTransition />
      <div>

        <History />
      </div>
    </>
  )
}

export default page;