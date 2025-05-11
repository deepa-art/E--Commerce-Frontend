import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div
      className="relative min-h-screen w-full"
      style={{ background: 'transparent !important', backgroundColor: 'transparent !important' }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        style={{ background: 'url(/login.avif) no-repeat right center/cover', backgroundColor: '#000000' }}
      >
        {/* Fallback color if image fails to load */}
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 py-8 md:py-12 lg:py-16 bg-transparent">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-12 bg-transparent">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Discover Amazing Products
          </h1>
          
          <div className="relative bg-transparent">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <Input
              value={keyword}
              name="keyword"
              onChange={(event) => setKeyword(event.target.value)}
              className="w-full py-6 pl-10 text-lg border-2 border-gray-300 focus:border-primary rounded-lg shadow-sm bg-transparent"
              placeholder="Search for products, brands, categories..."
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="w-full bg-transparent">
          {!searchResults.length ? (
            <div className="flex flex-col items-center justify-center py-20 bg-transparent">
              <div className="bg-gray-100 p-6 rounded-full mb-6">
                <Search className="h-12 w-12 text-gray-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {keyword ? "No results found" : "Start searching"}
              </h2>
              <p className="text-gray-600 max-w-md text-center">
                {keyword 
                  ? "Try different keywords or check for spelling mistakes"
                  : "Enter keywords to find products you're looking for"}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Showing {searchResults.length} results for "{keyword}"
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-transparent">
                {searchResults.map((item) => (
                  <ShoppingProductTile
                    key={item.id}
                    handleAddtoCart={handleAddtoCart}
                    product={item}
                    handleGetProductDetails={handleGetProductDetails}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;