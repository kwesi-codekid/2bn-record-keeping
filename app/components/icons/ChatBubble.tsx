const ChatBubbleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M22 11.567c0 5.283-4.478 9.566-10 9.566q-.977.001-1.935-.178c-.459-.087-.688-.13-.848-.105c-.16.024-.388.145-.842.386a6.5 6.5 0 0 1-4.224.657a5.3 5.3 0 0 0 1.087-2.348c.1-.53-.148-1.045-.52-1.422C3.034 16.411 2 14.105 2 11.567C2 6.284 6.478 2 12 2s10 4.284 10 9.567M11.996 12h.008m3.987 0H16m-8 0h.009"
      color="currentColor"
    ></path>
  </svg>
);

export default ChatBubbleIcon;
