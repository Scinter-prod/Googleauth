// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { getAuthUrl } from "@/utils/googleAuth";
// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const fetchUser = useCallback(async () => {
//     try {
//       const response = await fetch("/api/auth/user");
//       if (response.ok) {
//         const userData = await response.json();
//         setUser(userData);
//       }
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);

//   // const signIn = async () => {
//   //   try {
      
//   //     window.location.href = "/api/auth/google";
//   //   } catch (error) {
//   //     console.error("Error during sign in:", error);
//   //   }
//   // };

//   const signIn = async () => {
//   try {
//     const authUrl = getAuthUrl();
//     console.log("Authorization URL:", authUrl); // Log the URL
//     window.location.href = authUrl;
//   } catch (error) {
//     console.error("Error during sign in:", error);
//   }
// };
//   const signOut = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       setUser(null);
//       router.push("/");
//     } catch (error) {
//       console.error("Error during sign out:", error);
//     }
//   };

//   return { user, loading, signIn, signOut };
// }