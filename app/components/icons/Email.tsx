const EmailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="currentColor"
      d="M3 18q-.825 0-1.412-.587T1 16V4q0-.825.588-1.412T3 2h16q.825 0 1.413.588T21 4v4q0 .425-.288.713T20 9t-.712-.288T19 8V6l-7.475 4.675q-.125.075-.262.113t-.263.037t-.262-.037t-.263-.113L3 6v10h9q.425 0 .713.288T13 17t-.288.713T12 18zm8-9l8-5H3zM3 6v.25v-1.475v.025V4v.8v-.025V6.25zv10zm16 16q-1.65 0-2.825-1.175T15 18v-4.5q0-1.05.725-1.775T17.5 11t1.775.725T20 13.5V17q0 .425-.288.713T19 18t-.712-.288T18 17v-3.5q0-.2-.15-.35T17.5 13t-.35.15t-.15.35V18q0 .825.588 1.413T19 20t1.413-.587T21 18v-3q0-.425.288-.712T22 14t.713.288T23 15v3q0 1.65-1.175 2.825T19 22"
    ></path>
  </svg>
);

export default EmailIcon;
