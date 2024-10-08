import React, { useCallback, useMemo, useRef } from "react";
import QuillEditor, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomSizes = ['16px', '18px', '20px', '22px', '24px', '26px', '30px', '36px', '40px'];

const Size = Quill.import('formats/size');
Size.whitelist = CustomSizes;
Quill.register(Size, true);

const TextEditor = ({ onChange, value }) => {
  const quill = useRef();

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imageUrl = reader.result;
        const quillEditor = quill.current.getEditor();

        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, "image", imageUrl, "user");
      };

      reader.readAsDataURL(file);
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ size: CustomSizes.map((size) => `${size}`) }],
          [{ color: [] }],
          ["bold", "italic", "underline", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler]
  );

  const formats = [
    "size", 
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];

  return (
    <div className="setting-label">
      <QuillEditor
        ref={(el) => (quill.current = el)}
        theme="snow"
        value={value}
        formats={formats}
        modules={modules}
        onChange={(value) => onChange(value)}
      />
    </div>
  );
};

export default TextEditor;
