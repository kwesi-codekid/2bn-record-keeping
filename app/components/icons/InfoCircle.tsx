const InfoCircleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M12 16v-5h-.5m0 5h1M12 8.5V8"></path>
      <circle cx={12} cy={12} r={9}></circle>
    </g>
  </svg>
);

export default InfoCircleIcon;
