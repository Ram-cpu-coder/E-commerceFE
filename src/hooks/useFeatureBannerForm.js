import { useRef, useState } from "react";

const useFeatureBannerForm = () => {
    const [featureBannerImageFile, setFeatureBannerImageFile] = useState(null);
    const [featureBannerImagePreview, setFeatureBannerImagePreview] =
        useState("");
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isCreatingBanner, setIsCreatingBanner] = useState(false);

    const featureBannerImageRef = useRef(null);
    const handleFeatureBannerImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFeatureBannerImageFile(file);
        setFeatureBannerImagePreview(URL.createObjectURL(file));
    };

    const toggleProduct = (product) => {
        const exists = selectedProducts.find((p) => p._id === product._id);
        if (exists) {
            setSelectedProducts((prev) => prev.filter((p) => p._id !== product._id));
        } else {
            setSelectedProducts((prev) => [...prev, product]);
        }
    };

    const clearImage = () => {
        setFeatureBannerImageFile(null);
        setFeatureBannerImagePreview("");
        featureBannerImageRef.current.value = "";
    }
    return {
        featureBannerImageFile,
        featureBannerImagePreview,
        setFeatureBannerImagePreview,
        setFeatureBannerImageFile,
        featureBannerImageRef,
        handleFeatureBannerImageChange,
        toggleProduct,
        clearImage,
        setShowProductModal,
        showProductModal,
        selectedProducts,
        setSelectedProducts,
        setIsCreatingBanner,
        isCreatingBanner
    }
}

export default useFeatureBannerForm