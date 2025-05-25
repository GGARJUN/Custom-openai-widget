"use client";

import { BubbleBtn } from "./_compoents/BubbleBtn";
import { Amplify } from "aws-amplify";
import { amplifyConfig } from "@/lib/config/amplify";
import Header from "./_compoents/Header";

// Initialize Amplify
Amplify.configure(amplifyConfig, {
  ssr: true // Important for Next.js
});


export default function Home() {

  return (
    <div>
      <Header />
      <BubbleBtn />
    </div>
  );
}