import ImageKit from "imagekit-javascript";

const imagekit = new ImageKit({
  publicKey: "YOUR_PUBLIC_KEY",
  urlEndpoint: "YOUR_URL_ENDPOINT",
  authenticationEndpoint: "http://localhost:5000/auth"
});

export const B64Upload = async (file) => {
  try {

    // file ko base64 me convert karo
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    const base64File = await toBase64(file);

    // ImageKit upload
    const response = await imagekit.upload({
      file: base64File,
      fileName: file.name,
    });

    console.log("Uploaded URL:", response.url);
    return response.url;

  } catch (err) {
    console.error("Upload error:", err);
  }
};
