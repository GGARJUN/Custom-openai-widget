// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useSearchParams } from "next/navigation";
// import {
//   ChatContainer,
//   ChatForm,
//   ChatMessages,
//   MessageInput,
//   MessageList,
//   PromptSuggestions,
// } from "@/components/ui/chat";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// const MODELS = [
//   { id: "grok-3", name: "Grok 3" },
//   { id: "model-2", name: "Model 2" },
//   { id: "model-3", name: "Model 3" },
// ];

// export default function Widget({ onClose }) {
//   const searchParams = useSearchParams();
//   const [projectId, setProjectId] = useState("project1");
//   const [tags, setTags] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
//   const abortControllerRef = useRef(null);

//   // Get project_id and tags from query params
//   useEffect(() => {
//     const qProjectId = searchParams.get("project_id");
//     const qTags = searchParams.get("tags");
//     if (qProjectId) setProjectId(qProjectId);
//     if (qTags) setTags(qTags.split(","));
//   }, [searchParams]);

//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;
  
//     const newMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: input,
//     };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput("");
//     setIsLoading(true);
  
//     // Create a new AbortController for the request
//     abortControllerRef.current = new AbortController();
  
//     try {
//       const idToken = localStorage.getItem("idToken");
//       if (!idToken) {
//         throw new Error("No authentication token found. Please log in.");
//       }
  
//       const response = await fetch("/api/query", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`,
//         },
//         body: JSON.stringify({
//           query_text: input,
//           project_id: projectId,
//           tags: tags,
//           model: selectedModel,
//         }),
//         signal: abortControllerRef.current.signal,
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to process query");
//       }
  
//       const data = await response.json();
  
//       const botMessage = {
//         id: Date.now().toString(),
//         role: "assistant",
//         content: data.answer || "Sorry, I couldn't process that request.",
//       };
  
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       if (error.name === "AbortError") {
//         console.log("Request aborted");
//       } else {
//         console.error("Error:", error);
//         const errorMessage = {
//           id: Date.now().toString(),
//           role: "assistant",
//           content: error.message || "An error occurred. Please try again.",
//         };
//         setMessages((prev) => [...prev, errorMessage]);
//       }
//     } finally {
//       setIsLoading(false);
//       abortControllerRef.current = null;
//     }
//   };

//   const append = (message) => {
//     const newMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: message.content,
//     };
//     setMessages((prev) => [...prev, newMessage]);
//     handleSubmit({ preventDefault: () => {} });
//   };

//   const stop = () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//     setIsLoading(false);
//   };

//   const suggestions = [
//     "Solve: x² + 6x + 9 = 25",
//     "Generate a React button",
//     "Tell a short joke",
//   ];

//   return (
//     <div
//       className={cn(
//         "flex flex-col h-[450px] w-[400px] fixed bottom-5 right-5 rounded-lg bg-white border border-gray-200 shadow-lg"
//       )}
//     >
//       {/* Header */}
//       {/* Chat Area */}
//       <ChatContainer className="flex flex-col h-[450px] w-[400px] fixed bottom-5 right-5 rounded-lg bg-white border border-gray-200 shadow-lg">
//         <div className="flex justify-between items-center px-3 py-5 border-b border-gray-200 bg-gray-200 rounded-t-lg">
//           <h3 className="text-sm font-semibold text-gray-700">AI Assistant</h3>
//           <div className="flex items-center space-x-2">
//             {/* <Select value={selectedModel} onValueChange={setSelectedModel}>
//             <SelectTrigger
//               className="w-[140px] text-xs border-gray-300"
//               aria-label="Select AI model"
//             >
//               <SelectValue placeholder="Select Model" />
//             </SelectTrigger>
//             <SelectContent>
//               {MODELS.map((model) => (
//                 <SelectItem key={model.id} value={model.id}>
//                   {model.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select> */}
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 text-sm"
//               aria-label="Close chat"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//         {/* {messages.length === 0 && (
//           <PromptSuggestions append={append} suggestions={suggestions} />
//         )} */}
//         <ChatMessages className="grow overflow-y-auto p-3 ">
//           <MessageList messages={messages} isTyping={isLoading} />
//         </ChatMessages>
//         <div className="p-3">
//           <ChatForm className="" isPending={isLoading} handleSubmit={handleSubmit}>
//             {({ files, setFiles }) => (
//               <MessageInput
//                 value={input}
//                 onChange={handleInputChange}
//                 allowAttachments={false}
//                 files={files}
//                 setFiles={setFiles}
//                 stop={stop}
//                 isGenerating={isLoading}
//                 placeholder="Ask a question..."
//               />
//             )}
//           </ChatForm>
//         </div>
//       </ChatContainer>
//     </div>
//   );
// }



"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChatContainer,
  ChatForm,
  ChatMessages,
  MessageInput,
  MessageList,
} from "@/components/ui/chat";
import { cn } from "@/lib/utils";

const MODELS = [
  { id: "grok-3", name: "Grok 3" },
  { id: "model-2", name: "Model 2" },
  { id: "model-3", name: "Model 3" },
];

export default function Widget({ onClose }) {
  const searchParams = useSearchParams();
  const [projectId, setProjectId] = useState("project1");
  const [tags, setTags] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const abortControllerRef = useRef(null);

  // Get project_id and tags from query params
  useEffect(() => {
    const qProjectId = searchParams.get("project1");
    const qTags = searchParams.get("tags");
    if (qProjectId) setProjectId(qProjectId);
    if (qTags) setTags(qTags.split(","));
  }, [searchParams]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    // Create a new AbortController for the request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query_text: input,
          project_id: projectId,
          // tags: tags,
          // model: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process query");
      }

      const data = await response.json();

      const botMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.answer || "Sorry, I couldn't process that request.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Error:", error);
        const errorMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: error.message || "An error occurred. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const append = (message) => {
    const newMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message.content,
    };
    setMessages((prev) => [...prev, newMessage]);
    handleSubmit({ preventDefault: () => {} });
  };

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-[450px] w-[400px] fixed bottom-5 right-5 rounded-lg border border-gray-200 shadow-lg"
      )}
    >
      {/* Header */}
      <ChatContainer className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center px-3 py-5 border-b border-gray-200 bg-gray-200 rounded-t-lg">
          <h3 className="text-sm font-semibold text-gray-700">AI Assistant</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        <ChatMessages className="grow overflow-y-auto p-3">
          <MessageList messages={messages} isTyping={isLoading} />
        </ChatMessages>

        <div className="p-3">
          <ChatForm className="" isPending={isLoading} handleSubmit={handleSubmit}>
            {({ files, setFiles }) => (
              <MessageInput
                value={input}
                onChange={handleInputChange}
                allowAttachments={false}
                files={files}
                setFiles={setFiles}
                stop={stop}
                isGenerating={isLoading}
                placeholder="Ask a question..."
              />
            )}
          </ChatForm>
        </div>
      </ChatContainer>
    </div>
  );
}