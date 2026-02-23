import ResetPassword from "@/components/forgotPaassword/resetPassword";
import React, { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <ResetPassword />
      </Suspense>
    </>
  )
}

export default page