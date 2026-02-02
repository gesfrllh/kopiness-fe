// import { useRouter } from "next/router";
// import { useEffect } from "react";

// export default function AuthCallback() {
//   const router = useRouter();

//   useEffect(() => {
//     if(!router.isReady) return;

//     const token = router.query.token as string

//     if(!token) {
//       router.replace('/login')
//       return
//     }

//     localStorage.setItem('token', token)
//     router.replace
//   })
// }