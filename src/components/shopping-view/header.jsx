import { Store, LogOut, Menu, ShoppingBag, User } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");

    // Define IDs that should navigate directly without applying filters
    const nonFilterIds = ["home", "shop", "find", "contactus"];

    if (nonFilterIds.includes(getCurrentMenuItem.id)) {
      // Directly navigate to the path for non-filter items
      navigate(getCurrentMenuItem.path);
    } else {
      // Apply category filter for listing-related items (e.g., Men, Women, Children)
      const currentFilter = {
        category: [getCurrentMenuItem.id],
      };
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));

      // If on a listing page, update search params; otherwise, navigate
      if (location.pathname.includes("listing")) {
        setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        );
      } else {
        navigate(getCurrentMenuItem.path);
      }
    }
  }

  return (
    <nav className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6">
      {shoppingViewHeaderMenuItems.map((menuItem, index) => {
        let gradientClass;
        if (menuItem.id === "shop") {
          gradientClass = "from-blue-600 to-indigo-600";
        } else if (menuItem.id === "footwear") {
          gradientClass = "from-red-500 to-pink-500";
        } else {
          const cycleIndex = shoppingViewHeaderMenuItems
            .slice(0, index)
            .filter(
              (item) => item.id !== "shop" && item.id !== "footwear"
            ).length;
          gradientClass =
            cycleIndex % 4 === 0
              ? "from-teal-500 to-emerald-500"
              : cycleIndex % 4 === 1
              ? "from-purple-500 to-violet-500"
              : cycleIndex % 4 === 2
              ? "from-orange-500 to-amber-500"
              : "from-cyan-500 to-sky-500";
        }

        return (
          <Label
            key={menuItem.id}
            onClick={() => handleNavigate(menuItem)}
            className={`relative text-sm font-semibold cursor-pointer transition-all duration-300 px-2 py-1 rounded-md hover:scale-105
              bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}
              after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full`}
          >
            {menuItem.label}
          </Label>
        );
      })}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex items-center gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative bg-white hover:bg-gray-50 border-gray-200 rounded-full transition-all duration-200 shadow-sm"
        >
          <ShoppingBag className="w-6 h-6 text-gray-800" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 pr-3 shadow-md hover:shadow-lg transition-all duration-200">
            <Avatar className="bg-white">
              <AvatarFallback className="text-gray-800 font-bold">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-white truncate max-w-[120px]">
              {user?.userName}
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          className="w-64 bg-white rounded-lg border border-gray-100 shadow-md p-2"
        >
          <DropdownMenuLabel className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <User className="h-5 w-5 text-gray-600" />
            Welcome, {user?.userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200 my-1" />
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="text-gray-700 hover:bg-gray-50 rounded-md px-3 py-2 transition-colors duration-200 flex items-center gap-2"
          >
            <User className="h-4 w-4 text-blue-500" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200 my-1" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-gray-700 hover:bg-red-50 rounded-md px-3 py-2 transition-colors duration-200 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <Link to="/shop/home" className="flex items-center gap-2">
          <Store className="h-6 w-6 text-white" />
          <span className="text-xl font-bold text-white">Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden bg-white hover:bg-gray-50 border-gray-200 rounded-full transition-all duration-200"
            >
              <Menu className="h-6 w-6 text-gray-800" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-white">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:flex items-center space-x-6">
          <MenuItems />
        </div>
        <div className="hidden lg:flex items-center">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
