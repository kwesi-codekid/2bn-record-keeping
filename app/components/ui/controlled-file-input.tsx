import { useEffect, useState } from "react";

const CustomFileInput2 = (
  {
    id,
    name,
    label,
    setFile,
    defaultImage,
    showImagePreview = true,
  }: {
    id: string;
    name?: string;
    label: string;
    setFile: (file: any) => void;
    defaultImage?: string;
    showImagePreview?: boolean;
  },
  props: any
) => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(
    defaultImage || null
  );
  const [fileName, setFileName] = useState<string>("");

  const handleChange = (e: any) => {
    const selectedFile = e.target.files[0];
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/gif",
      "image/svg",
    ];

    if (selectedFile && validTypes.includes(selectedFile.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);

        if (selectedFile) {
          setFileName(selectedFile.name);
        }
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile); // Set the file for form submission
    } else {
      alert(
        "Invalid file type. Please upload an image file (jpeg, png, jpg, gif, svg)."
      );
    }
  };

  useEffect(() => {
    if (props.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(props.file);
    }
  }, [props.file]);

  return (
    <div className="grid grid-cols-2 gap-3 p-0 font-nunito">
      <label htmlFor={id} className="flex flex-col gap-2 cursor-pointer w-full">
        {label}
        <input type="file" id={id} className="hidden" onChange={handleChange} />
        <span className="text-sm font-nunito text-slate-800 outline-none border-dashed border-2 border-gray-300 w-full h-12 rounded-xl flex flex-col gap-2 items-center justify-center bg-slate-300/5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="size-10 text-blue-300"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775a5.25 5.25 0 0 1 10.233-2.33a3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5z"
            ></path>
          </svg>
        </span>
      </label>
      <div className="w-full h-full flex flex-col justify-end gap-2">
        <span className="text-xs text-slate-800 dark:text-slate-100 font-nunito">
          {fileName}
        </span>
        {showImagePreview && image && (
          <img
            src={image as string}
            alt="file preview"
            className="size-12 object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default CustomFileInput2;
