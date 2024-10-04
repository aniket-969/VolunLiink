import toast from "react-hot-toast";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export const validateImage = (file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG and PNG are allowed.");
        return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`File size should be less than ${MAX_IMAGE_SIZE / 1024 / 1024} MB.`);
        return false;
    }

    return true;
};
