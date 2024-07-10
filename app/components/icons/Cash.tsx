const CashIcon = ({ className }: { className: string }) => {
  return (
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
        color="currentColor"
      >
        <path d="M12 18c-1.332.622-3.083 1-5 1c-1.066 0-2.08-.117-3-.327c-.591-.136-.887-.203-1.241-.484a2.4 2.4 0 0 1-.565-.709C2 17.073 2 16.677 2 15.886V5.114c0-.985 1.04-1.661 2-1.441c.92.21 1.934.327 3 .327c1.917 0 3.668-.378 5-1s3.083-1 5-1c1.066 0 2.08.117 3 .327c.591.136.887.204 1.241.484c.202.16.454.476.565.709c.194.408.194.803.194 1.594v10.772c0 .985-1.04 1.661-2 1.441c-.92-.21-1.934-.327-3-.327c-1.917 0-3.668.378-5 1M2 21c1.333.622 3.083 1 5 1s3.668-.378 5-1s3.083-1 5-1s3.668.378 5 1"></path>
        <path d="M14.5 10.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0m-9 1v.009m13-2.017v.01"></path>
      </g>
    </svg>
  );
};

export default CashIcon;
