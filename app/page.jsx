"use client";

import { BubbleBtn } from "./_compoents/BubbleBtn";
// import { BubbleBtn } from "./_compoents/BubbleBtn";
// import { Amplify } from "aws-amplify";
// import { amplifyConfig } from "@/lib/config/amplify";
// import Header from "./_compoents/Header";
import Widget from "./_compoents/Widget";

// Initialize Amplify
// Amplify.configure(amplifyConfig, {
//   ssr: true // Important for Next.js
// });


export default function Home() {

  return (
    <div>
      {/* <Header />*/}
      <BubbleBtn /> 
      {/* <Widget/> */}
    </div>
  );
}