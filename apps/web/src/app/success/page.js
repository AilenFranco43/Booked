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
        <h1 className="text-4xl font-bold mb-4 text-green-600">
          Payment Successful
        </h1>

        <p className="text-lg mb-6">
          Your payment was processed successfully. Thank you!
        </p>

        <button
          onClick={handelClick}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
