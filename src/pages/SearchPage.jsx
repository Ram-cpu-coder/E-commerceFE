import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveProductAction,
  getPublicProductAction,
} from "../features/products/productActions";
import ProductCard from "../components/cards/ProductCard";
import { handleOnClickProduct } from "../utils/productFunctions";

const SearchPage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [closeIcon, setCloseIcon] = useState(false);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [searchedWord, setSearchedWord] = useState("");

  const dispatch = useDispatch();

  const { allActiveProducts } = useSelector((state) => state.productInfo);
  const { user } = useSelector((state) => state.userInfo);

  const handleOnSearch = (e) => {
    e.preventDefault();
    if (e.target.value.length > 0) {
      setCloseIcon(true);
    }
    setSearchedWord(e.target.value);
    searchFunction(e.target.value);
  };

  const fetchProducts = async () => {
    await dispatch(getActiveProductAction());
  };

  const searchFunction = async (keyWords) => {
    const data = await allActiveProducts.filter((item) =>
      item.name.toLowerCase().includes(keyWords.toLowerCase())
    );
    setDisplayProducts(data);
  };
  console.log(allActiveProducts, 87);

  const handleClearSearch = () => {
    setIsSearching(false);
    setCloseIcon(false);
    setSearchedWord("");
    setDisplayProducts([]);
  };
  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{ minHeight: "85vh" }}
    >
      <div
        className={`col-8 col-sm-12 ${
          isSearching ? "liveSearch" : "searchContainer"
        }`}
      >
        <input
          type="text"
          value={searchedWord}
          placeholder="Search Products..."
          className="form-control border shadow-lg"
          onChange={handleOnSearch}
          onClick={() => {
            setIsSearching(true);
            setCloseIcon(true);
          }}
        />
        {isSearching && closeIcon && (
          <AiOutlineClose
            className="fs-1 ms-2 text-muted icon"
            style={{ cursor: "pointer" }}
            onClick={handleClearSearch}
          />
        )}
      </div>

      {/* searched Products */}
      {isSearching && (
        <div className="py-5 w-100 d-flex justify-content-center">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 w-100">
            {displayProducts.length > 0 ? (
              displayProducts.map((item, index) => (
                <div
                  className="col"
                  style={{ cursor: "pointer" }}
                  key={index}
                  onClick={() => handleOnClickProduct(item, user, dispatch)}
                >
                  <ProductCard item={item} />
                </div>
              ))
            ) : (
              <div
                className="d-flex justify-content-center align-items-center fs-4 w-100 text-secondary"
                style={{ minHeight: "40vh" }}
              >
                No products found
                {searchedWord.length > 0 ? (
                  <p className="m-0">
                    &nbsp;for <strong>"{searchedWord}"</strong>
                  </p>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
