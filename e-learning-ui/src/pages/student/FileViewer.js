import React from "react";
import { Embed, Image } from "semantic-ui-react";

const FileViewer = ({ file }) => {
  const isImage = /\.(jpg|jpeg|png|gif|avif)$/i.test(file);
  const isPDF = /\.pdf$/i.test(file);

  console.log(file);

  return (
    <div style={{ width: 550 }}>
      {isImage && (
        <img
          src={file ? require(`../../assignments-upload/${file}`) : ""}
          alt="File"
          style={{ maxWidth: "100%" }}
          size="medium"
        />
      )}
      {isPDF && (
        <embed
          src={file ? require(`../../assignments-upload/${file}`) : ""}
          type="application/pdf"
          width={800}
          height="600px"
        />
      )}
    </div>
  );
};

export default FileViewer;
