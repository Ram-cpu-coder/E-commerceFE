import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getActiveProductAction } from "../features/products/productActions";
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
    const data = allActiveProducts.filter((item) =>
      item.name.toLowerCase().includes(keyWords.toLowerCase())
    );
    setDisplayProducts(data);
  };

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
      className="app-page d-flex flex-column align-items-center px-2"
      style={{ minHeight: "85vh" }}
    >
      <div
        className={`col-12 col-md-10 col-lg-8 d-flex flex-row justify-content-center align-items-center flex-wrap gap-2 ${
          isSearching ? "liveSearch" : "searchContainer"
        }`}
      >
        <label htmlFor="site-search" className="visually-hidden">
          Search products
        </label>
        <input
          id="site-search"
          type="search"
          value={searchedWord}
          placeholder="Search products…"
          className="form-control border shadow-sm"
          onChange={handleOnSearch}
          onClick={() => {
            setIsSearching(true);
            setCloseIcon(true);
          }}
          autoComplete="off"
        />
        {isSearching && closeIcon && (
          <button
            type="button"
            className="border-0 bg-transparent p-0 ms-2 align-self-center"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <AiOutlineClose className="fs-1 text-muted icon" aria-hidden />
          </button>
        )}
      </div>

      {isSearching && (
        <div className="py-5 w-100 d-flex justify-content-center px-2">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 w-100" style={{ maxWidth: 1200 }}>
            {displayProducts.length > 0 ? (
              displayProducts.map((item) => (
                <div
                  className="col"
                  style={{ cursor: "pointer" }}
                  key={item._id}
                  onClick={() => handleOnClickProduct(item, user, dispatch)}
                >
                  <ProductCard item={item} />
                </div>
              ))
            ) : (
              <div
                className="d-flex flex-column justify-content-center align-items-center w-100 text-secondary py-5"
                style={{ minHeight: "36vh" }}
              >
                <p className="fs-5 mb-0 text-center">No products found</p>
                {searchedWord.length > 0 && (
                  <p className="small mb-0 mt-2 text-center text-muted">
                    for <strong>&quot;{searchedWord}&quot;</strong>
                  </p>
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
