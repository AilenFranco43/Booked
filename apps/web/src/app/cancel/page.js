"use client";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter();

  const handelClick = () => {
    router.push("/");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-white min-h-screen text-black p-4">
        <h1 className="text-4xl font-bold mb-4 text-red-700">
          Payment Canceled
        </h1>

        <button
          onClick={handelClick}
          className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
