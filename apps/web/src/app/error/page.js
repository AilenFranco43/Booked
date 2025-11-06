"use client";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/"); // o "/home" si querés
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white min-h-screen text-black p-4">
      <h1 className="text-4xl font-bold mb-4">Payment Failed</h1>
      <p className="text-lg mb-6">
        We could not process your payment. Please try again.
      </p>
      <button
        onClick={handleClick}
        className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
      >
        Go Back
      </button>
    </div>
  );
}
