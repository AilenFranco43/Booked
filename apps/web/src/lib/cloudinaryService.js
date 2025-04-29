import axios from "axios";

export const uploadImage = async (file, folderType = "profile") => {
  try {
    // Validaciones
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Solo se permiten archivos JPEG o PNG");
    }

    const maxSize = folderType === "profile" ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`El archivo no debe exceder los ${maxSize / 1024 / 1024}MB`);
    }

    // Definir estructura de carpetas
    const folder = `booked/${folderType}`;
    
    // Obtener firma
    const timestamp = Math.round(new Date().getTime() / 1000);
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/cloudinary/signature`,
      { timestamp, folder }
    );

    // Subir imagen
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", data.signature);
    formData.append("folder", folder);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    throw error;
  }
};