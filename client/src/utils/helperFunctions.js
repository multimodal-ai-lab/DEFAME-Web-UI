  // Function to insert an image at the caret position
  export const insertImage = (src, editorRef) => {
    editorRef.current.focus(); // Focus the editor
    const img = document.createElement("img");
    img.src = src;

    img.className = "shared-image-style";

    const range = window.getSelection().getRangeAt(0);
    range.insertNode(img);

    // Move the caret below the inserted image
    range.setStartAfter(img);
    range.setEndAfter(img);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  };

  export const handleFileUpload = (e, editorRef) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => insertImage(event.target.result, editorRef);
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  export const handlePaste = (e,editorRef) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        const reader = new FileReader();

        reader.onload = (event) => {
          insertImage(event.target.result,editorRef);
        };

        reader.readAsDataURL(file);
      } else {
        // For text content, insert it at the current caret position
        const text = clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }
    }
  };

  export const parseContent = (editorRef) => {
    const contentElements = editorRef.current.childNodes;
    const parsedContentList = {
      content: [],
      author: "USER_IDENTIFIER",
      date: new Date().toISOString().split("T")[0],
    };
  
    const convertImageToBase64 = (imgElement) => {
      return new Promise((resolve) => {
        const file = imgElement.src;
        
        // Fetch the image as a blob (only works if it's a valid local file or data URL)
        fetch(file)
          .then(response => response.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = reader.result.split(',')[1]; // Remove "data:image/jpeg;base64,"
              resolve(base64String);
            };
            reader.readAsDataURL(blob);
            
          })
          .catch(() => resolve(null)); // Handle errors
      });
    };
  
    const processNode = async (node) => {
      if (node.nodeName === "IMG") {
        const base64Image = await convertImageToBase64(node);
        if (base64Image) {
          console.log("Base64 image:", base64Image);
          parsedContentList.content.push(["image", base64Image]);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          parsedContentList.content.push(["text", text]);
        }
      } else if (node.nodeName === "DIV") {
        const innerNodes = node.childNodes;
        for (const innerNode of innerNodes) {
          await processNode(innerNode);
        }
      }
    };
  
    const processContent = async () => {
      for (const node of contentElements) {
        await processNode(node);
      }
      return parsedContentList;
    };
  
    return processContent();
  };
  export const setTitle = (text) => {
    if (text.length > 30) {
      return text.slice(0, 30) + "...";
    } else return text;
  };
  