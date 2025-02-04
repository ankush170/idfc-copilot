import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect, useRef } from "react";

interface MessageProps {
  message: {
    sender: "user" | "bot";
    content: string;
    type?: "text" | "button" | "chart";
    buttons?: { label: string; value: string }[];
    chartComponent?: React.ReactNode;
  };
  onButtonClick?: (value: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onButtonClick }) => {
  const isUser = message.sender === "user";
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(!isUser);
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const escapeBoldAsterisks = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, "\\*\\*$1\\*\\*");
  };

  useEffect(() => {
    if (!isUser && message.type === "text") {
      let index = 0;
      setIsTyping(true);
      setDisplayedContent("");

      const typeNextChar = () => {
        if (index < message.content.length) {
          const newContent = escapeBoldAsterisks(
            message.content.slice(0, index + 1)
          );
          setDisplayedContent(newContent);
          index++;
          typingRef.current = setTimeout(typeNextChar, 35);
        } else {
          setIsTyping(false);
        }
      };

      typeNextChar();

      return () => {
        if (typingRef.current) clearTimeout(typingRef.current);
      };
    } else {
      setDisplayedContent(message.content);
      setIsTyping(false);
    }
  }, [isUser, message.content, message.type]);

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    onButtonClick?.(value);
  };

  const renderContent = () => {
    switch (message.type) {
      case "button":
        return (
          <div className="flex flex-col space-y-2">
            {message.buttons?.map((button, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="options"
                  value={button.value}
                  checked={selectedValue === button.value}
                  onChange={() => handleRadioChange(button.value)}
                  className="form-radio h-4 w-4 text-[#F1948A]"
                />
                <span className="text-md">{button.label}</span>
              </label>
            ))}
          </div>
        );
      case "chart":
        return (
          <div className="w-full my-4 overflow-x-auto">
            <div className="text-sm font-bold mb-2">{message.content}</div>
            <div className="min-w-[600px]">{message.chartComponent}</div>
          </div>
        );
      case "text":
      default:
        return (
          <div className="relative inline-block">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                strong: ({ node, ...props }) => (
                  <strong className="font-bold" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),
              }}
            >
              {displayedContent}
            </ReactMarkdown>
            {isTyping && (
              <span
                className="inline-block w-1 h-4 ml-1 bg-black animate-blink absolute"
                style={{ bottom: "0.4rem", right: "-0.6em" }}
              ></span>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`message ${isUser ? "user-message" : "bot-message"}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Message;
