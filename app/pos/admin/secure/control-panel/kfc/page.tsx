"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Receipt,
  Search,
  ChevronDown,
  X,
  PackagePlus,
  ShoppingBag,
  Trash2,
  Plus,
  TrendingUp,
  Trophy,
  IndianRupee,
  BarChart2,
  Package,
  List,
  Globe,
  Zap,
  Menu,
  History,
  ChevronLeft,
  ChevronRight,
  Percent,
  Calendar,
  Download,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  Shield,
  Lock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { verifyPasscode } from "@/app/pos/actions";

type CatalogItem = {
  id: string;
  name: string;
  desc?: string;
  price?: number;
};

type OrderItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  qty: number;
};

type CompletedOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  source: "ONLINE" | "OFFLINE";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountType?: "PERCENT" | "FIXED";
  discountValue?: number;
  deliveryFee: number;
  grandTotal: number;
  cashReceived: number;
  date: string;
  status: "Completed" | "Pending";
};

const SearchableItemInput = ({
  item,
  catalog,
  updateItem,
}: {
  item: OrderItem;
  catalog: CatalogItem[];
  updateItem: (id: string, field: keyof OrderItem, value: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCatalog = catalog.filter(
    (c) =>
      c.name.toLowerCase().includes(internalSearch.toLowerCase()) ||
      (c.desc && c.desc.toLowerCase().includes(internalSearch.toLowerCase())),
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [internalSearch, isOpen]);

  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      const activeItem = listRef.current.children[selectedIndex] as HTMLElement;
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== "Escape") {
      setIsOpen(true);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCatalog.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCatalog[selectedIndex]) {
        const catItem = filteredCatalog[selectedIndex];
        updateItem(item.id, "name", catItem.name);
        updateItem(item.id, "desc", catItem.desc || "");
        if (catItem.price !== undefined) {
          updateItem(item.id, "price", catItem.price);
        }
        setIsOpen(false);
        setTimeout(() => {
          const priceInput = document.getElementById(`price-${item.id}`);
          if (priceInput) priceInput.focus();
        }, 50);
      } else if (internalSearch.trim()) {
        updateItem(item.id, "name", internalSearch.trim());
        updateItem(item.id, "desc", "");
        setIsOpen(false);
        setTimeout(() => {
          const priceInput = document.getElementById(`price-${item.id}`);
          if (priceInput) priceInput.focus();
        }, 50);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className={`relative cursor-pointer bg-[#FFFFFF] border ${isOpen ? "border-black/10 bg-white" : "border-black/10"} hover:border-black/10 rounded-lg px-4 py-2.5 transition-colors flex justify-between items-center group`}
        onClick={() => {
          setIsOpen(!isOpen);
          setInternalSearch("");
        }}
      >
        <div className="flex-1">
          <div className="font-semibold text-[#000000] text-sm">
            {item.name || (
              <span className="text-[#000000] font-normal">
                Select an item...
              </span>
            )}
          </div>
          {item.desc && !isOpen && (
            <div className="text-[10px] text-[#000000] mt-0.5">{item.desc}</div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#000000] group-hover:text-[#FF0000] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#FFFFFF] border border-black/10 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-black/10 bg-[#FFFFFF]">
            <div className="bg-[#FFFFFF] flex items-center px-3 py-2 rounded-md">
              <Search className="w-4 h-4 text-[#000000] mr-2" />
              <input
                type="text"
                placeholder="Search catalog..."
                className="w-full bg-transparent text-[#000000] text-sm focus:outline-none placeholder:text-[#000000]"
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCatalog.length > 0 ? (
              <ul className="py-1" ref={listRef}>
                {filteredCatalog.map((catItem, idx) => (
                  <li
                    key={catItem.id}
                    className={`px-5 py-3 cursor-pointer border-b border-transparent last:border-0 transition-colors ${idx === selectedIndex ? "bg-[#FFFFFF] border-l-4 border-l-[#FF0000]" : "hover:bg-[#FFFFFF] border-l-4 border-l-transparent"}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      updateItem(item.id, "name", catItem.name);
                      updateItem(item.id, "desc", catItem.desc || "");
                      if (catItem.price !== undefined) {
                        updateItem(item.id, "price", catItem.price);
                      }
                      setIsOpen(false);
                      setTimeout(() => {
                        const priceInput = document.getElementById(
                          `price-${item.id}`,
                        );
                        if (priceInput) priceInput.focus();
                      }, 50);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      updateItem(item.id, "name", catItem.name);
                      updateItem(item.id, "desc", catItem.desc || "");
                      if (catItem.price !== undefined) {
                        updateItem(item.id, "price", catItem.price);
                      }
                      setIsOpen(false);
                      setTimeout(() => {
                        const priceInput = document.getElementById(
                          `price-${item.id}`,
                        );
                        if (priceInput) priceInput.focus();
                      }, 50);
                    }}
                    onClick={() => {
                      updateItem(item.id, "name", catItem.name);
                      updateItem(item.id, "desc", catItem.desc || "");
                      if (catItem.price !== undefined) {
                        updateItem(item.id, "price", catItem.price);
                      }
                      setIsOpen(false);
                      setTimeout(() => {
                        const priceInput = document.getElementById(
                          `price-${item.id}`,
                        );
                        if (priceInput) priceInput.focus();
                      }, 50);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="text-sm font-bold text-[#000000]">
                      {catItem.name}
                    </div>
                    {catItem.desc && (
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#000000] mt-1">
                        {catItem.desc}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-6 text-sm text-[#000000] text-center font-semibold">
                Press Enter to use "{internalSearch}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function POSBilling() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [role, setRole] = useState<'staff' | 'admin' | null>(null);
  const [passcode, setPasscode] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string>("");
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<
    "billing" | "orders" | "analytics"
  >("billing");
  const [isOnline, setIsOnline] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    { id: "1", name: "", desc: "", price: 0, qty: 1 },
  ]);
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"fixed" | "percent">(
    "fixed",
  );
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<number>(0);

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Analytics filter/navigation states
  const [analyticsPeriod, setAnalyticsPeriod] = useState<
    "all" | "today" | "week" | "month" | "year" | "custom"
  >("all");
  const [analyticsStartDate, setAnalyticsStartDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [analyticsEndDate, setAnalyticsEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [analyticsSubTab, setAnalyticsSubTab] = useState<
    "revenue" | "today" | "products" | "coupons"
  >("revenue");
  const [analyticsSearchPhone, setAnalyticsSearchPhone] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [couponSearchQuery, setCouponSearchQuery] = useState("");

  useEffect(() => {
    const auth =
      sessionStorage.getItem("pos_authorized") ||
      localStorage.getItem("pos_authorized");
    const storedRole = 
      sessionStorage.getItem("pos_role") ||
      localStorage.getItem("pos_role");
      
    if (auth === "true") {
      sessionStorage.setItem("pos_authorized", "true");
      if (storedRole) {
        sessionStorage.setItem("pos_role", storedRole);
        setRole(storedRole as 'staff' | 'admin');
        if (storedRole === 'staff') {
          setActiveTab('billing');
        }
      } else {
        setRole('admin');
      }
      setIsAuthorized(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleVerifyPasscode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = await verifyPasscode(passcode);
    if (result && result.success) {
      sessionStorage.setItem("pos_authorized", "true");
      sessionStorage.setItem("pos_role", result.role || "admin");
      setRole(result.role as 'staff' | 'admin');
      if (result.role === 'staff') {
        setActiveTab('billing');
      }
      setIsAuthorized(true);
      setPasscode("");
      setPasscodeError("");
    } else {
      setPasscodeError("Incorrect passcode. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("pos_authorized");
    localStorage.removeItem("pos_authorized");
    sessionStorage.removeItem("pos_role");
    localStorage.removeItem("pos_role");
    setRole(null);
    setPasscode("");
    setPasscodeError("");
    setIsAuthorized(false);
  };

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const { data: productsData } = await supabase
        .from("products")
        .select("*");
      const defaultCategories: any[] = [];

      if (productsData) {
        setCatalog([
          ...defaultCategories,
          ...productsData.map((p) => ({
            id: p.id,
            name: p.name,
            desc: p.description,
            price: p.default_price || undefined,
          }))
        ]);
      } else {
        setCatalog(defaultCategories);
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select(
          `
          *,
          customers(name, phone),
          order_items (*)
        `,
        )
        .order("created_at", { ascending: false });

      if (ordersData) {
        setOrders(
          ordersData.map((o: any) => ({
            id: o.id,
            customerName: o.customers?.name || "Guest",
            customerPhone: (o.customers?.phone || "").split("_")[0],
            source: o.source,
            items: o.order_items.map((i: any) => ({
              id: i.id,
              name: i.snapshot_name,
              desc:
                i.snapshot_name === "Custom Item" || !i.product_id
                  ? "Custom"
                  : "",
              price: i.snapshot_price,
              qty: i.quantity,
            })),
            subtotal: o.subtotal,
            discount: o.discount_amount,
            discountType: o.discount_type,
            discountValue: o.discount_value,
            deliveryFee: o.delivery_fee,
            grandTotal: o.grand_total,
            cashReceived: o.cash_received,
            date: o.created_at,
            status: o.status === "COMPLETED" ? "Completed" : "Pending",
          })),
        );
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Modal State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CompletedOrder | null>(
    null,
  );
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatPrice, setNewCatPrice] = useState<number | "">("");

  const [activeCatalogRowId, setActiveCatalogRowId] = useState<string | null>(
    null,
  );
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogTargetRowId, setCatalogTargetRowId] = useState<string | null>(
    null,
  );

  // Order search/filters state
  const [orderSearchId, setOrderSearchId] = useState("");
  const [orderSearchName, setOrderSearchName] = useState("");
  const [orderSearchPhone, setOrderSearchPhone] = useState("");
  const [orderFilterSource, setOrderFilterSource] = useState("ALL");
  const [orderFilterStatus, setOrderFilterStatus] = useState("ALL");
  const [historyPeriod, setHistoryPeriod] = useState<
    "all" | "today" | "week" | "month" | "year" | "custom"
  >("all");
  const [historyStartDate, setHistoryStartDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [historyEndDate, setHistoryEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const [selectedCoupon, setSelectedCoupon] = useState<string>("none");
  const coupons = [
    { code: "none", label: "No Coupon", type: "fixed", value: 0 },
    {
      code: "WELCOME10",
      label: "WELCOME10 (10% Off)",
      type: "percent",
      value: 10,
    },
    {
      code: "SUPERPOS",
      label: "SUPERPOS (₹100 Off)",
      type: "fixed",
      value: 100,
    },
    {
      code: "FESTIVE15",
      label: "FESTIVE15 (15% Off)",
      type: "percent",
      value: 15,
    },
  ];

  const handleCouponChange = (code: string) => {
    setSelectedCoupon(code);
    const coupon = coupons.find((c) => c.code === code);
    if (coupon) {
      setDiscountType(coupon.type as "fixed" | "percent");
      setDiscountValue(coupon.value);
    }
  };

  const getCouponCodeForOrder = (order: CompletedOrder) => {
    if (order.discount === 0) return "NONE";
    const matched = coupons.find((c) => {
      if (c.code === "none") return false;
      if (order.discountType && order.discountValue) {
        const typeMatches =
          c.type === (order.discountType === "PERCENT" ? "percent" : "fixed");
        const valMatches = c.value === order.discountValue;
        return typeMatches && valMatches;
      }
      if (c.type === "fixed") {
        return c.value === order.discount;
      } else {
        const calculated = order.subtotal * (c.value / 100);
        return Math.abs(calculated - order.discount) < 2;
      }
    });
    return matched ? matched.code.toUpperCase() : "PROMO";
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(), name: "", desc: "", price: 0, qty: 1 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const clearOrder = () => {
    setItems([
      { id: Math.random().toString(), name: "", desc: "", price: 0, qty: 1 },
    ]);
  };

  const addToCatalog = async () => {
    if (!newCatName.trim()) return;

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: newCatName,
        description: newCatDesc,
        default_price: newCatPrice || 0,
        category: "Custom",
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding to catalog", error);
      return;
    }

    if (data) {
      const newItem: CatalogItem = {
        id: data.id,
        name: data.name,
        desc: data.description,
        price: data.default_price || undefined,
      };
      setCatalog([...catalog, newItem]);

      if (catalogTargetRowId) {
        updateItem(catalogTargetRowId, "name", data.name);
        if (data.default_price !== undefined) {
          updateItem(catalogTargetRowId, "price", data.default_price || 0);
        }
        setCatalogTargetRowId(null);
      }

      setNewCatName("");
      setNewCatDesc("");
      setNewCatPrice("");
      setShowCatalogModal(false);
    }
  };

  const deleteFromCatalog = async (id: string) => {
    if (!id.startsWith("default-")) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
        
      if (error) {
        console.error("Error deleting from catalog", error);
        alert("Failed to delete item from catalog.");
        return;
      }
    }

    setCatalog((prev) => prev.filter((c) => c.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const calculatedDiscount =
    discountType === "percent"
      ? subtotal * (discountValue / 100)
      : discountValue;
  const grandTotal = Math.max(0, subtotal - calculatedDiscount) + deliveryFee;

  const handleSendWhatsApp = async (appType: 'personal' | 'business' = 'personal') => {
    if (!customerPhone || customerPhone.length !== 10) {
      alert(
        "Please enter a valid 10-digit mobile contact number to send the bill.",
      );
      return;
    }

    const currentYear = new Date().getFullYear();
    let newOrderId = "";
    let isUnique = false;
    let attempts = 0;

    try {
      while (!isUnique && attempts < 10) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let randStr = "";
        for (let i = 0; i < 5; i++) {
          randStr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const tempId = `INV-${currentYear}-${randStr}`;
        const existsLocally = orders.some((o) => o.id === tempId);
        if (!existsLocally) {
          const { data } = await supabase
            .from("orders")
            .select("id")
            .eq("id", tempId)
            .maybeSingle();
          if (!data) {
            newOrderId = tempId;
            isUnique = true;
          }
        }
        attempts++;
      }
    } catch (err) {
      console.error("Error generating secure random invoice number:", err);
    }

    if (!newOrderId) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let randStr = "";
      for (let i = 0; i < 5; i++) {
        randStr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newOrderId = `INV-${currentYear}-${randStr}`;
    }
    const itemsToSave = items.filter((i) => i.name && i.price > 0);

    // Format unique phone: phone_name_timestamp to bypass unique constraint
    const dbPhone = `${customerPhone}_${customerName || "Guest"}_${Date.now()}`;
    const { data: custData, error: custErr } = await supabase
      .from("customers")
      .upsert(
        { name: customerName || "Guest", phone: dbPhone },
        { onConflict: "phone" },
      )
      .select()
      .single();

    if (!custErr && custData) {
      await supabase.from("orders").insert({
        id: newOrderId,
        customer_id: custData.id,
        source: isOnline ? "ONLINE" : "OFFLINE",
        status: "COMPLETED",
        subtotal,
        discount_type: discountType === "percent" ? "PERCENT" : "FIXED",
        discount_value: discountValue,
        discount_amount: calculatedDiscount,
        delivery_fee: deliveryFee,
        grand_total: grandTotal,
        cash_received: cashReceived,
      });

      await supabase.from("order_items").insert(
        itemsToSave.map((i) => ({
          order_id: newOrderId,
          snapshot_name: i.name,
          snapshot_price: i.price,
          quantity: i.qty,
        })),
      );
    }

    const domain = window.location.origin;
    const invoiceUrl = `${domain}/invoice/${newOrderId}`;

    const shopEmoji = String.fromCodePoint(0x2728);
    const checkEmoji = String.fromCodePoint(0x2705);
    const tagEmoji = String.fromCodePoint(0x1F516);
    const moneyEmoji = String.fromCodePoint(0x1F4B0);
    const receiptEmoji = String.fromCodePoint(0x1F4E6);

    let message = `${shopEmoji} *Korean Fried Chicken* ${shopEmoji}\n\n`;
    message += `${checkEmoji} Thank you for shopping with us!\n\n`;
    
    if (calculatedDiscount > 0) {
      message += `${tagEmoji} Discount Applied: ₹${calculatedDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n`;
    }
    
    message += `${moneyEmoji} Total Amount: ₹${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n\n`;
    message += `${receiptEmoji} View and download your detailed digital receipt here:\n${invoiceUrl}`;

    const encodedMessage = encodeURIComponent(message);
    let whatsappUrl = `https://api.whatsapp.com/send/?phone=91${customerPhone}&text=${encodedMessage}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, "_blank");
    }

    const newOrder: CompletedOrder = {
      id: newOrderId,
      customerName: customerName || "Guest",
      customerPhone,
      source: isOnline ? "ONLINE" : "OFFLINE",
      items: itemsToSave,
      subtotal,
      discount: calculatedDiscount,
      discountType: discountType === "percent" ? "PERCENT" : "FIXED",
      discountValue: discountValue,
      deliveryFee,
      grandTotal,
      cashReceived,
      date: new Date().toISOString(),
      status: "Completed",
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Reset Form
    setCustomerName("");
    setCustomerPhone("");
    setItems([{ id: "1", name: "", desc: "", price: 0, qty: 1 }]);
    setDiscountValue(0);
    setDeliveryFee(0);
    setCashReceived(0);
  };

  // Real-time analytics derived from orders with period filtering
  const now = new Date();

  const analyticsFilteredOrders = orders.filter((o) => {
    if (
      analyticsSearchPhone &&
      !o.customerPhone.includes(analyticsSearchPhone)
    ) {
      return false;
    }
    const orderDate = new Date(o.date);
    if (analyticsPeriod === "today") {
      return (
        orderDate.getDate() === now.getDate() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    if (analyticsPeriod === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday start of week
      startOfWeek.setHours(0, 0, 0, 0);
      return orderDate >= startOfWeek;
    }
    if (analyticsPeriod === "month") {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    if (analyticsPeriod === "year") {
      return orderDate.getFullYear() === now.getFullYear();
    }
    if (analyticsPeriod === "custom") {
      const orderTime = orderDate.getTime();
      const start = analyticsStartDate ? new Date(analyticsStartDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      const end = analyticsEndDate ? new Date(analyticsEndDate) : null;
      if (end) end.setHours(23, 59, 59, 999);

      if (start && end) {
        return orderTime >= start.getTime() && orderTime <= end.getTime();
      } else if (start) {
        return orderTime >= start.getTime();
      } else if (end) {
        return orderTime <= end.getTime();
      }
      return true;
    }
    return true; // "all"
  });

  const totalOrdersCount = analyticsFilteredOrders.length;
  const totalRevenueAmount = analyticsFilteredOrders.reduce(
    (acc, o) => acc + o.grandTotal,
    0,
  );
  const avgOrderValue =
    totalOrdersCount > 0 ? totalRevenueAmount / totalOrdersCount : 0;

  // Split channels
  const onlineOrders = analyticsFilteredOrders.filter(
    (o) => o.source === "ONLINE",
  ).length;
  const offlineOrders = analyticsFilteredOrders.filter(
    (o) => o.source === "OFFLINE",
  ).length;

  // Split revenues
  const onlineRevenue = analyticsFilteredOrders
    .filter((o) => o.source === "ONLINE")
    .reduce((acc, o) => acc + o.grandTotal, 0);
  const offlineRevenue = analyticsFilteredOrders
    .filter((o) => o.source === "OFFLINE")
    .reduce((acc, o) => acc + o.grandTotal, 0);

  // Top items by revenue in analyticsFilteredOrders
  const itemSales: Record<
    string,
    { name: string; revenue: number; qty: number }
  > = {};
  analyticsFilteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!item.name) return;
      if (!itemSales[item.name])
        itemSales[item.name] = { name: item.name, revenue: 0, qty: 0 };
      itemSales[item.name].revenue += item.price * item.qty;
      itemSales[item.name].qty += item.qty;
    });
  });
  const topItems = Object.values(itemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Helper to get ISO week number of the year
  const getWeekOfYear = (d: Date) => {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    target.setDate(target.getDate() - dayNr + 3); // Nearest Thursday
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };
  const currentWeekNumber = getWeekOfYear(now);

  // Revenue per day of current week (Mon–Sun) - CONSTANT (independent of analyticsPeriod filters)
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekRevenue = [0, 0, 0, 0, 0, 0, 0];
  
  // Find Monday to Sunday of current calendar week
  const currentDayOfWeek = now.getDay();
  const distToMon = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const mondayOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + distToMon);
  mondayOfThisWeek.setHours(0, 0, 0, 0);
  
  const sundayOfThisWeek = new Date(mondayOfThisWeek);
  sundayOfThisWeek.setDate(mondayOfThisWeek.getDate() + 6);
  sundayOfThisWeek.setHours(23, 59, 59, 999);

  orders.forEach((order) => {
    if (analyticsSearchPhone) {
      const q = analyticsSearchPhone.toLowerCase();
      const matchPhone = order.customerPhone.includes(q);
      const matchInvoice = order.id.toLowerCase().includes(q);
      if (!matchPhone && !matchInvoice) {
        return;
      }
    }
    const orderDate = new Date(order.date);
    const orderTime = orderDate.getTime();
    if (orderTime >= mondayOfThisWeek.getTime() && orderTime <= sundayOfThisWeek.getTime()) {
      const day = (orderDate.getDay() + 6) % 7;
      weekRevenue[day] += order.grandTotal;
    }
  });
  const maxWeekRevenue = Math.max(...weekRevenue, 1);

  // Revenue per month of current year - CONSTANT (independent of analyticsPeriod filters)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthRevenue = Array(12).fill(0);
  orders.forEach((order) => {
    if (analyticsSearchPhone) {
      const q = analyticsSearchPhone.toLowerCase();
      const matchPhone = order.customerPhone.includes(q);
      const matchInvoice = order.id.toLowerCase().includes(q);
      if (!matchPhone && !matchInvoice) {
        return;
      }
    }
    const d = new Date(order.date);
    if (d.getFullYear() === now.getFullYear()) {
      monthRevenue[d.getMonth()] += order.grandTotal;
    }
  });
  const maxMonthRevenue = Math.max(...monthRevenue, 1);
  const totalYearRevenue = monthRevenue.reduce((a, b) => a + b, 0);
  const avgMonthRevenue = totalYearRevenue / 12;

  // New Detailed KPI Computations based on analyticsFilteredOrders
  const todayOrders = orders.filter((o) => {
    if (analyticsSearchPhone) {
      const q = analyticsSearchPhone.toLowerCase();
      const matchPhone = o.customerPhone.includes(q);
      const matchInvoice = o.id.toLowerCase().includes(q);
      if (!matchPhone && !matchInvoice) {
        return false;
      }
    }
    const d = new Date(o.date);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const todayRevenue = todayOrders.reduce((acc, o) => acc + o.grandTotal, 0);

  const todayOrdersCount = todayOrders.length;
  const todayOnlineOrdersCount = todayOrders.filter(
    (o) => o.source === "ONLINE",
  ).length;
  const todayOfflineOrdersCount = todayOrders.filter(
    (o) => o.source === "OFFLINE",
  ).length;

  const todayOnlineRevenue = todayOrders
    .filter((o) => o.source === "ONLINE")
    .reduce((acc, o) => acc + o.grandTotal, 0);
  const todayOfflineRevenue = todayOrders
    .filter((o) => o.source === "OFFLINE")
    .reduce((acc, o) => acc + o.grandTotal, 0);

  const todayItemsSold = todayOrders.reduce(
    (acc, o) => acc + o.items.reduce((sum, item) => sum + item.qty, 0),
    0,
  );

  // Today's top items
  const todayItemSales: Record<
    string,
    { name: string; revenue: number; qty: number }
  > = {};
  todayOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!item.name) return;
      if (!todayItemSales[item.name])
        todayItemSales[item.name] = { name: item.name, revenue: 0, qty: 0 };
      todayItemSales[item.name].revenue += item.price * item.qty;
      todayItemSales[item.name].qty += item.qty;
    });
  });
  const todayTopItems = Object.values(todayItemSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const monthlyRevenue = orders
    .filter((o) => {
      const d = new Date(o.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, o) => acc + o.grandTotal, 0);

  const totalItemsSold = analyticsFilteredOrders.reduce(
    (acc, o) => acc + o.items.reduce((sum, item) => sum + item.qty, 0),
    0,
  );

  const categorySales: Record<string, number> = {};
  analyticsFilteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      const cat = item.desc || "Uncategorized";
      if (!categorySales[cat]) categorySales[cat] = 0;
      categorySales[cat] += item.price * item.qty;
    });
  });
  const topCategory =
    Object.keys(categorySales).length > 0
      ? Object.entries(categorySales).sort((a, b) => b[1] - a[1])[0][0]
      : "None";
  const topProduct = topItems[0]?.name || "None";

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FCD814]"></div>
          <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Abstract Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E60000]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FCD814]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Main Container */}
        <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Side Branding */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-3xl p-4 border border-white/10 shadow-2xl mb-8 group hover:scale-105 transition-transform duration-500">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-lg group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#E60000] animate-pulse" />
              <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">System Online</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 tracking-tight leading-[1.1] mb-6">
              Next-Gen <br/> POS Control.
            </h1>
            <p className="text-white/50 text-base md:text-lg font-medium leading-relaxed max-w-md">
              Seamlessly manage orders, analytics, and digital invoices for Korean Fried Chicken through a unified, hyper-fast portal.
            </p>
          </div>

          {/* Right Side Login Card */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_70px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              
              {/* Card internal glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FCD814]/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
                <p className="text-white/40 text-sm font-medium mb-10">Enter your secure passcode to access the terminal.</p>
                
                <form onSubmit={handleVerifyPasscode} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] ml-1">
                      Security Passcode
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPasscode ? "text" : "password"}
                        name="update-pos-passcode"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-[#E60000] focus:bg-black/60 rounded-2xl pl-14 pr-14 py-4 text-white font-bold tracking-widest text-lg focus:outline-none transition-all placeholder:text-white/20"
                        value={passcode}
                        onChange={(e) => {
                          setPasscode(e.target.value);
                          if (passcodeError) setPasscodeError("");
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode(!showPasscode)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors cursor-pointer"
                      >
                        {showPasscode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passcodeError && (
                      <p className="text-xs text-[#E60000] font-bold mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                        {passcodeError}
                      </p>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#E60000] to-[#990000] hover:from-[#FF1A1A] hover:to-[#CC0000] active:scale-[0.98] text-white rounded-2xl font-bold text-sm uppercase tracking-[0.15em] transition-all shadow-[0_10px_30px_rgba(230,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(230,0,0,0.5)] flex items-center justify-center gap-3 mt-4 group cursor-pointer"
                  >
                    Authenticate
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-white/30 text-[10px] font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              End-to-End Encrypted Session
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders for Order History tab
  const historyFilteredOrders = orders.filter((order) => {
    const matchId = order.id
      .toLowerCase()
      .includes(orderSearchId.toLowerCase());
    const matchName = order.customerName
      .toLowerCase()
      .includes(orderSearchName.toLowerCase());
    const matchPhone = (order.customerPhone || "").includes(orderSearchPhone);
    const matchSource =
      orderFilterSource === "ALL" || order.source === orderFilterSource;
    const matchStatus =
      orderFilterStatus === "ALL" ||
      order.status.toUpperCase() === orderFilterStatus.toUpperCase();

    // Period match
    let matchPeriod = true;
    if (historyPeriod !== "all") {
      const orderDate = new Date(order.date);
      const orderTime = orderDate.getTime();
      const now = new Date();

      if (historyPeriod === "today") {
        matchPeriod = orderDate.toDateString() === now.toDateString();
      } else if (historyPeriod === "week") {
        const currentDay = now.getDay();
        const distanceToMon = currentDay === 0 ? -6 : 1 - currentDay;
        const startOfWeek = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + distanceToMon,
        );
        startOfWeek.setHours(0, 0, 0, 0);
        matchPeriod = orderTime >= startOfWeek.getTime();
      } else if (historyPeriod === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        matchPeriod = orderTime >= startOfMonth.getTime();
      } else if (historyPeriod === "year") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        matchPeriod = orderTime >= startOfYear.getTime();
      } else if (historyPeriod === "custom") {
        const start = historyStartDate ? new Date(historyStartDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        const end = historyEndDate ? new Date(historyEndDate) : null;
        if (end) end.setHours(23, 59, 59, 999);

        if (start && end) {
          matchPeriod =
            orderTime >= start.getTime() && orderTime <= end.getTime();
        } else if (start) {
          matchPeriod = orderTime >= start.getTime();
        } else if (end) {
          matchPeriod = orderTime <= end.getTime();
        }
      }
    }

    return (
      matchId &&
      matchName &&
      matchPhone &&
      matchSource &&
      matchStatus &&
      matchPeriod
    );
  });

  const handleExportCSV = () => {
    if (historyFilteredOrders.length === 0) {
      alert("No orders available to export.");
      return;
    }

    // CSV Headers padded with spaces to ensure columns default to a readable width in Excel
    const headers = [
      "Order ID          ",
      "Date                   ",
      "Customer Name           ",
      "Customer Phone          ",
      "Source        ",
      "Subtotal      ",
      "Discount      ",
      "Delivery Fee  ",
      "Grand Total   ",
      "Status        ",
      "Items                                                                               ",
    ];

    // CSV Rows
    const rows = historyFilteredOrders.map((o) => {
      const itemsStr = o.items.map((i) => `${i.name} (x${i.qty})`).join("; ");

      // Formatting date: MM/DD/YYYY HH:MM AM/PM as an Excel text formula to prevent ### errors
      const dateObj = new Date(o.date);
      const dateStr = dateObj.toLocaleDateString();
      const timeStr = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedDate = `"=""${dateStr} ${timeStr}"""`;

      // Formatting phone number as an Excel text formula to prevent scientific notation
      const formattedPhone = o.customerPhone
        ? `"=""${o.customerPhone}"""`
        : `"N/A"`;

      return [
        o.id,
        formattedDate,
        o.customerName,
        formattedPhone,
        o.source,
        o.subtotal,
        o.discount,
        o.deliveryFee,
        o.grandTotal,
        o.status,
        `"${itemsStr.replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((val) => {
            if (typeof val === "string" && !val.startsWith('"')) {
              return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Order_History_${historyPeriod}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] flex flex-row font-sans overflow-hidden">
      {/* Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] w-full max-w-md overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 flex justify-between items-center bg-[#FFFFFF]">
              <h3 className="font-bold text-lg text-[#000000] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF0000]/10 rounded-lg flex items-center justify-center">
                  <PackagePlus className="w-5 h-5 text-[#FF0000]" />
                </div>
                Add New Item
              </h3>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="w-8 h-8 flex items-center justify-center bg-[#000000] text-[#FFFFFF] hover:bg-black/80 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-8 py-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bone Shot"
                  className="minimal-input font-bold text-sm"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., CHICKEN"
                  className="minimal-input text-sm"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                  Default Price (Optional)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 299"
                  className="minimal-input text-sm font-semibold"
                  value={newCatPrice}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) =>
                    setNewCatPrice(
                      e.target.value === "" ? "" : parseFloat(e.target.value),
                    )
                  }
                />
              </div>
              <button
                onClick={addToCatalog}
                className="w-full py-4 mt-4 bg-[#990000] hover:bg-[#CC0000] text-[#FFFFFF] rounded-lg font-bold text-xs uppercase tracking-[0.15em] transition-colors"
              >
                Save to Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile/Tablet Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Collapsible Left Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 bottom-0 left-0 bg-[#E60000] text-[#FFFFFF] flex flex-col justify-between h-screen shrink-0 shadow-xl z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64 border-r border-white/10 translate-x-0" : "w-0 min-w-0 border-r-0 -translate-x-64 overflow-hidden"}`}
      >
        <div className="w-64 flex flex-col justify-between h-full shrink-0 overflow-hidden relative">
          <div className="flex flex-col">
            {/* Header branding */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFFFFF] rounded-xl flex items-center justify-center shadow-inner overflow-hidden shrink-0">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div>
                  <span className="font-black text-sm tracking-tight text-[#FFFFFF] block ">
                    Korean Fried Chicken
                  </span>
                </div>
              </div>

              {/* Close Button Inside Sidebar */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white font-bold hover:text-white transition-all cursor-pointer"
                title="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="px-4 py-6 space-y-2">
              <button
                onClick={() => setActiveTab("billing")}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "billing"
                    ? "bg-[#FFFFFF] text-[#CC0000] shadow-lg scale-102"
                    : "text-white font-bold hover:bg-white/10 hover:text-white"
                }`}
              >
                <Receipt className="w-5 h-5" />
                Billing Panel
              </button>
              {role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "orders"
                        ? "bg-[#FFFFFF] text-[#CC0000] shadow-lg scale-102"
                        : "text-white font-bold hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <History className="w-5 h-5" />
                    Order History
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "analytics"
                        ? "bg-[#FFFFFF] text-[#CC0000] shadow-lg scale-102"
                        : "text-white font-bold hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <BarChart2 className="w-5 h-5" />
                    Analytics Dashboard
                  </button>
                </>
              )}

              <div className="pt-4 border-t border-white/10 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-black/20 hover:bg-[#FF6B6B]/10 transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </nav>
          </div>

          {/* Footer branding */}
          <div className="p-6 border-t border-white/10 flex items-center justify-start gap-4">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-black shrink-0">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <p className="text-[10px] text-[#FCD814] mt-1 font-semibold uppercase tracking-wider">
              V2.1.0 • PREMIUM POS
            </p>
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto px-3 sm:px-8 lg:px-12 pt-3 pb-8 relative flex flex-col animate-in fade-in duration-300">
        {/* Global Top Navbar */}
        <header className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-black/10 w-full mb-6 gap-4">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-9 h-9 bg-white border border-black/10 hover:bg-[#FFFFFF]/40 rounded-lg flex items-center justify-center transition-all shadow-sm cursor-pointer"
                title="Open Menu"
              >
                <Menu className="w-4.5 h-4.5 text-[#FF0000]" />
              </button>
            )}
            <div>
              <h1 className="text-lg font-black text-[#000000] tracking-tight ">
                Korean Fried Chicken
              </h1>
            </div>
          </div>

          {/* OFFLINE / ONLINE Toggle (only shown when billing tab is active) */}
          {activeTab === "billing" && (
            <div className="flex items-center bg-[#FFFFFF]/60 border border-black/10 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setIsOnline(false)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all uppercase cursor-pointer ${!isOnline ? "bg-[#E11D48] text-[#FFFFFF] shadow-sm" : "text-[#000000] hover:text-[#000000]"}`}
              >
                <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
                OFFLINE (POS)
              </button>
              <button
                onClick={() => setIsOnline(true)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all uppercase cursor-pointer ${isOnline ? "bg-[#00A86B] text-[#FFFFFF] shadow-sm" : "text-[#000000] hover:text-[#000000]"}`}
              >
                <span className="w-2 h-2 rounded-full bg-[#00A86B]"></span>
                ONLINE ORDER
              </button>
            </div>
          )}
        </header>

        {activeTab === "billing" && (
          <div className="flex-1 flex flex-col gap-6 max-w-[1400px] min-w-0 mx-auto w-full">
            {/* Subheader Accent Bar and Title */}
            <div className="flex justify-between items-center py-2 border-b border-black/10 w-full">
              <div className="flex items-center gap-4">
                <span className="w-1.5 h-8 bg-[#FF0000] rounded-full"></span>
                <div>
                  <h2 className="text-xl font-black text-[#000000] tracking-tight">
                    POS Billing Panel
                  </h2>
                  <p className="text-[11px] text-[#000000] font-semibold mt-0.5">
                    Quick Invoice generator & database synced checkout
                  </p>
                </div>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              {/* Left Column */}
              <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col gap-6 h-auto lg:h-full">
                {/* Customer Details */}
                <div className="flex-shrink-0 bg-white border border-black/10 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group">
                  <h2 className="text-base font-black flex items-center gap-3 text-[#000000] mb-6 tracking-tight">
                    <User className="w-4 h-4 text-[#FF0000]" />
                    Customer Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter name"
                        className="w-full bg-[#FFFFFF]/40 border border-black/10 hover:border-black/10 focus:border-[#FF0000] focus:bg-white rounded-lg px-4 py-2.5 text-[#000000] text-sm font-semibold focus:outline-none transition-colors placeholder:text-[#000000] placeholder:font-normal shadow-sm"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.15em] mb-2">
                        Mobile Number (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter 10-digit number"
                        maxLength={10}
                        className="w-full bg-[#FFFFFF]/40 border border-black/10 hover:border-black/10 focus:border-[#FF0000] focus:bg-white rounded-lg px-4 py-2.5 text-[#000000] text-sm font-semibold focus:outline-none transition-colors placeholder:text-[#000000] placeholder:font-normal shadow-sm"
                        value={customerPhone}
                        onChange={(e) =>
                          setCustomerPhone(
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                      />
                    </div>
                  </div>
                </div>


                {/* Order Items Ledger */}
                <div className="flex-1 bg-white border border-black/10 rounded-xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col overflow-visible">
                  <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-transparent gap-4">
                    <h2 className="text-base font-black flex items-center gap-3 text-[#000000] tracking-tight">
                      <Receipt className="w-4 h-4 text-[#FF0000]" />
                      Order Items
                    </h2>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                      <button
                        onClick={clearOrder}
                        className="text-[10px] font-bold text-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border border-black/10 px-4 py-2 rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Clear Order
                      </button>
                      <button
                        onClick={() => {
                          setNewCatName("");
                          setNewCatDesc("");
                          setNewCatPrice("");
                          setCatalogTargetRowId(null);
                          setShowCatalogModal(true);
                        }}
                        className="text-[10px] font-bold text-[#000000] bg-[#FFFFFF] hover:bg-[#FFFFFF] border border-black/10 px-4 py-2 rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PackagePlus className="w-3.5 h-3.5 text-[#FF0000]" />{" "}
                        Add To Catalog
                      </button>
                      <button
                        onClick={addItem}
                        className="text-[10px] font-bold text-[#FF0000] bg-[#FF0000]/5 hover:bg-[#FF0000]/10 border border-[#FF0000]/20 px-4 py-2 rounded-lg uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Custom Item
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 overflow-visible">
                    {/* Table Header */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b border-black/10 text-[9px] font-black text-[#000000] uppercase tracking-[0.15em] mt-4 mb-2">
                      <div className="col-span-7 pl-2">
                        Item Name / Description
                      </div>
                      <div className="col-span-2 text-center">Price (₹)</div>
                      <div className="col-span-2 text-center">Qty</div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-4 pt-2 overflow-visible">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-stretch sm:items-center group border-b border-transparent pb-4 pt-1 overflow-visible relative"
                        >
                          {/* Item Name / Description Input + Catalog Button */}
                          <div className="col-span-7 relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                            <input
                              type="text"
                              placeholder="Type custom product description..."
                              className="flex-1 bg-white border border-black/10 focus:border-[#FF0000] rounded-lg px-4 py-2 text-xs font-semibold text-[#000000] focus:outline-none transition-colors placeholder:text-[#000000] min-w-0"
                              value={item.name}
                              onChange={(e) =>
                                updateItem(item.id, "name", e.target.value)
                              }
                            />
                            <button
                              onClick={() => {
                                setActiveCatalogRowId(
                                  activeCatalogRowId === item.id
                                    ? null
                                    : item.id,
                                );
                                setCatalogSearch("");
                              }}
                              className="flex items-center justify-center gap-1.5 border border-[#FF0000]/30 bg-[#FF0000]/5 text-[#FF0000] hover:bg-[#FF0000]/10 px-3 py-2 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-wider shrink-0 cursor-pointer w-full sm:w-auto"
                            >
                              <List className="w-3.5 h-3.5" />
                              Catalog
                            </button>

                            {/* Catalog Dropdown Popover */}
                            {activeCatalogRowId === item.id && (
                              <div className="absolute z-[80] top-full left-0 mt-1 w-full sm:w-80 max-w-[calc(100vw-2.5rem)] bg-[#FFFFFF] border-2 border-black/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="p-2 border-b border-black/10 bg-[#FFFFFF] flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    placeholder="Search catalog items..."
                                    className="w-full bg-white border border-black/10 focus:border-[#FF0000] rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none transition-colors"
                                    value={catalogSearch}
                                    onChange={(e) =>
                                      setCatalogSearch(e.target.value)
                                    }
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => setActiveCatalogRowId(null)}
                                    className="text-[#000000] hover:text-[#FF0000] cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                  {catalog.filter((c) =>
                                    c.name
                                      .toLowerCase()
                                      .includes(catalogSearch.toLowerCase()),
                                  ).length > 0 ? (
                                    catalog
                                      .filter((c) =>
                                        c.name
                                          .toLowerCase()
                                          .includes(
                                            catalogSearch.toLowerCase(),
                                          ),
                                      )
                                      .map((catItem) => (
                                        <div
                                          key={catItem.id}
                                          className="w-full flex items-center border-b border-transparent last:border-0 hover:bg-[#FFFFFF] transition-colors"
                                        >
                                          <button
                                            className="flex-1 text-left px-4 py-2.5 flex flex-col cursor-pointer"
                                            onClick={() => {
                                              updateItem(
                                                item.id,
                                                "name",
                                                catItem.name,
                                              );
                                              if (catItem.price !== undefined) {
                                                updateItem(
                                                  item.id,
                                                  "price",
                                                  catItem.price,
                                                );
                                              }
                                              setActiveCatalogRowId(null);
                                            }}
                                          >
                                            <span className="text-xs font-bold text-[#000000]">
                                              {catItem.name}
                                            </span>
                                            {catItem.desc && (
                                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#000000] mt-0.5">
                                                {catItem.desc}
                                              </span>
                                            )}
                                            {catItem.price !== undefined && (
                                              <span className="text-[10px] font-bold text-[#FF0000] mt-0.5">
                                                ₹{catItem.price}
                                              </span>
                                            )}
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (window.confirm("Are you sure you want to delete this item from the catalog?")) {
                                                deleteFromCatalog(catItem.id);
                                              }
                                            }}
                                            className="px-4 py-2.5 text-[#000000] hover:text-[#FF0000] transition-colors cursor-pointer"
                                            title="Delete item"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ))
                                  ) : (
                                    <div className="px-4 py-4 text-center">
                                      <div className="text-xs text-[#000000] font-semibold mb-2">
                                        No items match "{catalogSearch}"
                                      </div>
                                      <button
                                        onClick={() => {
                                          setNewCatName(catalogSearch);
                                          setCatalogTargetRowId(item.id);
                                          setShowCatalogModal(true);
                                          setActiveCatalogRowId(null);
                                        }}
                                        className="text-[10px] font-bold text-[#FF0000] bg-[#FF0000]/10 hover:bg-[#FF0000]/20 px-3 py-1.5 rounded uppercase tracking-wider transition-colors cursor-pointer"
                                      >
                                        + Add to Catalog
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Price, Qty, and Trash (Flex row on mobile, separate grid cells on desktop) */}
                          <div className="col-span-5 flex items-center justify-between sm:grid sm:grid-cols-5 gap-3 sm:gap-4 w-full">
                            {/* Price Input */}
                            <div className="flex-1 sm:col-span-2 flex items-center gap-2 sm:block">
                              <span className="text-[10px] font-bold text-[#000000] uppercase sm:hidden shrink-0">
                                Price:
                              </span>
                              <input
                                type="number"
                                className="w-full min-w-[70px] sm:min-w-0 text-center bg-white border border-black/10 focus:border-[#FF0000] rounded-lg px-3 py-2 text-xs font-semibold text-[#000000] focus:outline-none transition-colors"
                                value={item.price || ""}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "price",
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                onWheel={(e) => e.currentTarget.blur()}
                                placeholder="0"
                              />
                            </div>

                            {/* Quantity Counter */}
                            <div className="flex-1 sm:col-span-2 flex items-center justify-end gap-2 sm:block">
                              <span className="text-[10px] font-bold text-[#000000] uppercase sm:hidden shrink-0">
                                Qty:
                              </span>
                              <div className="flex items-center border border-black/10 bg-white rounded-lg overflow-hidden h-[36px] max-w-[90px] shrink-0">
                                <button
                                  className="w-7 h-full flex items-center justify-center text-[#000000] hover:bg-[#FFFFFF] hover:text-[#FF0000] font-bold text-xs transition-colors cursor-pointer"
                                  onClick={() =>
                                    updateItem(
                                      item.id,
                                      "qty",
                                      Math.max(1, item.qty - 1),
                                    )
                                  }
                                >
                                  −
                                </button>
                                <span className="flex-1 text-center font-bold text-xs text-[#000000] min-w-[18px]">
                                  {item.qty}
                                </span>
                                <button
                                  className="w-7 h-full flex items-center justify-center text-[#000000] hover:bg-[#FFFFFF] hover:text-[#FF0000] font-bold text-xs transition-colors cursor-pointer"
                                  onClick={() =>
                                    updateItem(item.id, "qty", item.qty + 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Trash Button */}
                            <div className="sm:col-span-1 flex justify-end shrink-0">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-[#000000] hover:text-[#E11D48] hover:bg-[#FEE2E2] p-2 rounded-lg border border-black/10 hover:border-transparent transition-colors flex items-center justify-center cursor-pointer"
                                title="Remove Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>{" "}
              {/* Right Column - Premium Light Order Panel */}
              <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col shrink-0 bg-white text-[#000000] border border-black/10 rounded-2xl shadow-sm lg:sticky lg:top-28 lg:self-start transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 overflow-hidden group">
                <div className="p-4 sm:p-6 pb-4 border-b border-black/10 flex justify-between items-center bg-[#FFFFFF]">
                  <h2 className="text-base font-black flex items-center gap-3 text-[#000000] tracking-tight">
                    <ShoppingBag className="w-4 h-4 text-[#FF0000]" />
                    Current Order
                  </h2>
                  <span
                    className={`flex items-center gap-2 bg-white border border-black/10 px-3 py-1 rounded-full font-bold text-[9px] ${isOnline ? "text-[#00A86B]" : "text-[#E11D48]"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#00A86B]" : "bg-[#E11D48]"}`}
                    ></span>
                    {isOnline ? "ONLINE ORDER" : "OFFLINE (POS)"}
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-5">
                  {/* Customer Details Box */}
                  <div className="bg-[#FFFFFF]/40 border border-black/10 rounded-xl p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#000000] font-semibold">
                        SOURCE
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border ${isOnline ? "border-[#00A86B] text-[#00A86B] bg-[#00A86B]/10" : "border-[#E11D48] text-[#E11D48] bg-[#E11D48]/10"}`}
                      >
                        {isOnline ? "ONLINE" : "OFFLINE"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#000000] font-semibold">
                        CUSTOMER
                      </span>
                      <span className="font-bold text-[#000000] truncate max-w-[65%] text-right">
                        {customerName || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#000000] font-semibold">
                        PHONE
                      </span>
                      <span className="font-bold text-[#000000]">
                        {customerPhone || "-"}
                      </span>
                    </div>

                    {/* Items summary list inside customer details box */}
                    <div className="border-t border-black/10 pt-2.5 mt-2.5">
                      {items.filter((i) => i.name).length === 0 ? (
                        <div className="text-center py-2 text-[10px] text-[#000000] font-semibold italic">
                          No items added yet
                        </div>
                      ) : (
                        <div className="max-h-24 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
                          {items
                            .filter((i) => i.name)
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center text-[10px]"
                              >
                                <span className="text-[#000000] font-semibold">
                                  {item.qty}x {item.name}
                                </span>
                                <span className="font-bold text-[#FF0000]">
                                  ₹
                                  {(item.price * item.qty).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 },
                                  )}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Discounts section */}
                  <div className="space-y-4 pt-1">
                    {/* Manual Discount */}
                    <div>
                      <label className="block text-[10px] font-bold text-[#000000] uppercase tracking-[0.1em] mb-1.5">
                        Manual Discount
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={discountType}
                          onChange={(e) => {
                            setDiscountType(
                              e.target.value as "fixed" | "percent",
                            );
                            setSelectedCoupon("none");
                          }}
                          className="bg-white border border-black/10 text-[#000000] rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#FF0000] cursor-pointer"
                        >
                          <option value="fixed">₹</option>
                          <option value="percent">%</option>
                        </select>
                        <input
                          type="number"
                          className="flex-1 text-right bg-white border border-black/10 rounded-lg px-3 py-2 text-xs font-bold text-[#000000] placeholder:text-[#000000] focus:outline-none focus:border-[#FF0000] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none min-w-0"
                          value={discountValue || ""}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) => {
                            setDiscountValue(parseFloat(e.target.value) || 0);
                            setSelectedCoupon("none");
                          }}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Subtotal & Delivery Breakdown */}
                    <div className="space-y-2.5 pt-2 border-t border-black/10">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-[#000000]">
                          Subtotal (
                          {items
                            .filter((i) => i.name)
                            .reduce((sum, i) => sum + i.qty, 0)}{" "}
                          items)
                        </span>
                        <span className="font-bold text-[#000000]">
                          ₹
                          {subtotal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-[#000000]">Delivery</span>
                        <input
                          type="number"
                          className="w-20 text-right bg-white border border-black/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#000000] placeholder:text-[#000000] focus:outline-none focus:border-[#FF0000]"
                          value={deliveryFee || ""}
                          onWheel={(e) => e.currentTarget.blur()}
                          onChange={(e) =>
                            setDeliveryFee(parseFloat(e.target.value) || 0)
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="flex justify-between items-center text-sm font-bold pt-4 border-t border-black/10">
                      <span className="text-[#000000] uppercase tracking-wider">
                        Grand Total
                      </span>
                      <span className="text-xl text-[#FF0000] font-black">
                        ₹
                        {grandTotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Cash Payment */}
                    <div className="bg-[#FFFFFF]/40 border border-black/10 rounded-xl p-4 mt-2">
                      <span className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-0.5">
                        Cash Payment
                      </span>
                      <label className="block text-[10px] font-bold text-[#000000] mb-2.5">
                        Amount Received (₹)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-white border border-black/10 focus:border-[#FF0000] rounded-lg px-3 py-2 text-base font-bold text-[#000000] placeholder:text-[#000000] focus:outline-none transition-colors"
                        value={cashReceived || ""}
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) =>
                          setCashReceived(parseFloat(e.target.value) || 0)
                        }
                        placeholder="0.00"
                      />
                    </div>

                    {/* Change Return */}
                    {cashReceived > 0 && (
                      <div className="flex justify-between items-center bg-white border border-black/10 rounded-lg p-3 text-xs">
                        <span className="font-bold text-[#000000] uppercase tracking-[0.05em]">
                          Change Return
                        </span>
                        <span
                          className={`font-black text-sm ${cashReceived >= grandTotal ? "text-[#00A86B]" : "text-[#E11D48]"}`}
                        >
                          ₹
                          {Math.max(
                            0,
                            cashReceived - grandTotal,
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}

                    {/* Send Bill Button */}
                    <button
                      onClick={() => handleSendWhatsApp('business')}
                      className="w-full mt-2 bg-[#10B981] hover:bg-[#059669] text-white py-3 rounded-lg font-bold text-[10px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-[0_4px_14px_rgba(16,185,129,0.4)] cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.012c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                      </svg>
                      Send Bill Via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {role === "admin" && activeTab === "orders" && (
          <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full pb-8 pr-2 animate-in fade-in duration-300">
            {/* Header Panel */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h2 className="text-[28px] font-black text-[#000000] tracking-tight">
                  Order History
                </h2>
                <p className="text-xs text-[#000000] font-semibold mt-1">
                  Manage and track past invoices
                </p>
              </div>

              {orders.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="flex flex-wrap items-center bg-[#FFFFFF] border border-black/10 rounded-xl p-1 gap-1 max-w-full">
                    <span className="text-[9px] font-bold text-[#000000] uppercase tracking-wider px-2">
                      Period:
                    </span>
                    {(["all", "today", "week", "month", "year"] as const).map(
                      (p) => {
                        const displayLabel =
                          p === "all"
                            ? "All Time"
                            : p === "today"
                              ? "Today"
                              : p === "week"
                                ? "This Week"
                                : p === "month"
                                  ? "This Month"
                                  : "This Year";
                        const isActive = historyPeriod === p;
                        return (
                          <button
                            key={p}
                            onClick={() => {
                              setHistoryPeriod(p);
                              setHistoryStartDate("");
                              setHistoryEndDate("");
                            }}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                              isActive
                                ? "bg-[#990000] text-[#FFFFFF] shadow-sm"
                                : "text-[#000000] hover:bg-[#000000]/50"
                            }`}
                          >
                            {displayLabel}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <div className="flex flex-wrap items-center border rounded-xl px-3 py-1.5 gap-2 shadow-sm bg-white border-black/10 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#000000]">
                        From:
                      </span>
                      <input
                        type="date"
                        value={historyStartDate}
                        onChange={(e) => {
                          setHistoryPeriod("custom");
                          setHistoryStartDate(e.target.value);
                        }}
                        className="text-xs font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-[#000000] w-[115px]"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#000000]">
                        To:
                      </span>
                      <input
                        type="date"
                        value={historyEndDate}
                        onChange={(e) => {
                          setHistoryPeriod("custom");
                          setHistoryEndDate(e.target.value);
                        }}
                        className="text-xs font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-[#000000] w-[115px]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#FF0000] bg-transparent text-[#FF0000] hover:bg-[#FF0000] hover:text-[#FFFFFF] rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-xl bg-[#FFFFFF] py-12">
                <p className="text-[#000000] font-medium">
                  No past transactions yet.
                </p>
              </div>
            ) : (
              <>
                {/* Search and Filters Bar */}
                <div className="bg-white border-2 border-black/10 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
                    <div>
                      <label className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                        Search Order ID
                      </label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#000000] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. INV-..."
                          className="w-full bg-[#FFFFFF]/30 border border-black/10 focus:border-[#FF0000] rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold text-[#000000] focus:outline-none"
                          value={orderSearchId}
                          onChange={(e) => setOrderSearchId(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Search name..."
                        className="w-full bg-[#FFFFFF]/30 border border-black/10 focus:border-[#FF0000] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#000000] focus:outline-none"
                        value={orderSearchName}
                        onChange={(e) => setOrderSearchName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                        Customer Phone
                      </label>
                      <input
                        type="text"
                        placeholder="Search phone..."
                        className="w-full bg-[#FFFFFF]/30 border border-black/10 focus:border-[#FF0000] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#000000] focus:outline-none"
                        value={orderSearchPhone}
                        onChange={(e) => setOrderSearchPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                        Order Source
                      </label>
                      <select
                        className="w-full bg-[#FFFFFF]/30 border border-black/10 focus:border-[#FF0000] rounded-lg px-3 py-1.5 text-xs font-bold text-[#000000] focus:outline-none cursor-pointer"
                        value={orderFilterSource}
                        onChange={(e) => setOrderFilterSource(e.target.value)}
                      >
                        <option value="ALL">All Sources</option>
                        <option value="ONLINE">Online Orders</option>
                        <option value="OFFLINE">Offline (POS)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {(() => {
                  const filteredOrders = historyFilteredOrders;

                  if (filteredOrders.length === 0) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-xl bg-[#FFFFFF] py-12">
                        <p className="text-[#000000] font-semibold">
                          No transactions match your search filters.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="bg-[#FFFFFF] border-2 border-black/10 rounded-xl shadow-sm overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FFFFFF] border-b border-black/10">
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Order ID
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Customer Name
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Mobile Number
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Source
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest">
                              Total Due
                            </th>
                            <th className="p-4 text-[10px] font-bold text-[#000000] uppercase tracking-widest text-right">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => (
                            <tr
                              key={order.id}
                              className="border-b border-transparent hover:bg-[#FFFFFF] transition-colors"
                            >
                              <td className="p-4 text-xs font-semibold text-[#000000]">
                                {order.id}
                              </td>
                              <td className="p-4 text-xs font-bold text-[#000000]">
                                {order.customerName}
                              </td>
                              <td className="p-4 text-xs font-mono font-bold text-[#000000]">
                                {order.customerPhone || "-"}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border ${order.source === "ONLINE" ? "border-[#00A86B] text-[#00A86B] bg-[#00A86B]/10" : "border-[#E11D48] text-[#E11D48] bg-[#E11D48]/10"}`}
                                >
                                  {order.source}
                                </span>
                              </td>
                              <td className="p-4 text-sm font-black text-[#FF0000]">
                                ₹{order.grandTotal.toLocaleString()}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <span className="px-3 py-1 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold uppercase tracking-wider">
                                    {order.status}
                                  </span>
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-[10px] font-bold text-[#000000] hover:text-[#FF0000] uppercase tracking-wider underline underline-offset-2"
                                  >
                                    Details
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {role === "admin" && activeTab === "analytics" && (
          <div className="flex-1 flex flex-col max-w-[1400px] min-w-0 mx-auto w-full pb-8 pr-2">
            {/* Header Panel */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h2 className="text-[28px] font-black text-[#000000] tracking-tight">
                  POS Analytics
                </h2>
                <p className="text-xs text-[#000000] font-semibold mt-1">
                  Real-time store & channel insights
                </p>
              </div>

              {/* Period Filters & Refresh Button */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {analyticsSubTab !== "today" && (
                  <>
                    <div className="flex flex-wrap items-center bg-[#FFFFFF] border border-black/10 rounded-xl p-1 gap-1 max-w-full">
                      <span className="text-[9px] font-bold text-[#000000] uppercase tracking-wider px-2">
                        Period:
                      </span>
                      {(["all", "today", "week", "month", "year"] as const).map(
                        (p) => {
                          const displayLabel =
                            p === "all"
                              ? "All Time"
                              : p === "today"
                                ? "Today"
                                : p === "week"
                                  ? "This Week"
                                  : p === "month"
                                    ? "This Month"
                                    : "This Year";
                          const isActive = analyticsPeriod === p;
                          return (
                            <button
                              key={p}
                              onClick={() => {
                                setAnalyticsPeriod(p);
                                setAnalyticsStartDate("");
                                setAnalyticsEndDate("");
                              }}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                isActive
                                  ? "bg-[#990000] text-[#FFFFFF] shadow-sm"
                                  : "text-[#000000] hover:bg-[#000000]/50"
                              }`}
                            >
                              {displayLabel}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <div className="flex flex-wrap items-center border rounded-xl px-3 py-1.5 gap-2 shadow-sm bg-white border-black/10 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#000000]">
                          From:
                        </span>
                        <input
                          type="date"
                          value={analyticsStartDate}
                          onChange={(e) => {
                            setAnalyticsPeriod("custom");
                            setAnalyticsStartDate(e.target.value);
                          }}
                          className="text-xs font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-[#000000] w-[115px]"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#000000]">
                          To:
                        </span>
                        <input
                          type="date"
                          value={analyticsEndDate}
                          onChange={(e) => {
                            setAnalyticsPeriod("custom");
                            setAnalyticsEndDate(e.target.value);
                          }}
                          className="text-xs font-bold bg-transparent border-none outline-none focus:ring-0 cursor-pointer text-[#000000] w-[115px]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sub Navigation Tabs */}
            <div className="flex border-b border-black/10 mb-6 gap-6 overflow-x-auto scrollbar-none pb-0.5 w-full shrink-0">
              {(["revenue", "today", "products", "coupons"] as const).map(
                (tab) => {
                  const isActive = analyticsSubTab === tab;
                  const displayLabel =
                    tab === "today"
                      ? "Today's Sales"
                      : tab === "revenue"
                        ? "Revenue"
                        : tab === "products"
                          ? "Products"
                          : "Coupons";
                  return (
                    <button
                      key={tab}
                      onClick={() => setAnalyticsSubTab(tab)}
                      className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer shrink-0 ${
                        isActive
                          ? "text-[#FF0000]"
                          : "text-[#000000] hover:text-[#000000]"
                      }`}
                    >
                      {displayLabel}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF0000] rounded-full" />
                      )}
                    </button>
                  );
                },
              )}
            </div>

            {/* Tab Contents */}
            {analyticsSubTab === "today" && (
              <>
                {/* Today's KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Today's Revenue
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3 text-[#10B981] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{todayRevenue.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Completed today
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Today's Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#3B82F6]/10 flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-[#3B82F6] animate-swing" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {todayOrdersCount}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Completed today
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Today's Items Sold
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                        <Package className="w-3 h-3 text-[#8B5CF6] animate-pop" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {todayItemsSold} pcs
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Quantity sold today
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Today's Avg Order Value
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-[#F97316] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹
                      {Math.round(
                        todayOrdersCount > 0
                          ? todayRevenue / todayOrdersCount
                          : 0,
                      ).toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Per invoice today
                    </div>
                  </div>
                </div>

                {/* Today's Detailed Split */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 mb-8">
                  {/* Left Side: Today's Order Source & Leaderboard */}
                  <div className="col-span-8 w-full flex flex-col gap-6">
                    {/* Today's Transactions Table */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <h3 className="font-bold text-[#000000] text-sm">
                          Today's Transactions
                        </h3>

                        {/* Contact Search Input */}
                        <div className="flex items-center border border-black/10 bg-[#FFFFFF] rounded-lg px-3 py-1.5 gap-2 shadow-xs w-full sm:w-auto animate-in fade-in duration-200">
                          <Search className="w-3.5 h-3.5 text-[#000000]" />
                          <input
                            type="text"
                            placeholder="Search contact/invoice..."
                            className="text-xs font-semibold bg-transparent border-none outline-none focus:ring-0 text-[#000000] placeholder:text-[#000000]/50 w-full sm:w-[170px]"
                            value={analyticsSearchPhone}
                            onChange={(e) =>
                              setAnalyticsSearchPhone(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      {todayOrders.length === 0 ? (
                        <div className="text-center text-[#000000] text-xs font-semibold py-12">
                          {analyticsSearchPhone
                            ? "No matching transactions found."
                            : "No orders placed today."}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#FFFFFF] border-b border-black/10">
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                                  Invoice ID
                                </th>
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                                  Customer No
                                </th>
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                                  Source
                                </th>
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                                  Items
                                </th>
                                <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                                  Grand Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {todayOrders.map((order) => (
                                <tr
                                  key={order.id}
                                  className="border-b border-transparent hover:bg-[#FFFFFF]/50 transition-colors"
                                >
                                  <td className="p-3 text-xs font-semibold text-[#000000]">
                                    {order.id}
                                  </td>
                                  <td className="p-3 text-xs font-mono font-bold text-[#000000]">
                                    {order.customerPhone || "-"}
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border ${order.source === "ONLINE" ? "border-[#00A86B] text-[#00A86B] bg-[#00A86B]/10" : "border-[#E11D48] text-[#E11D48] bg-[#E11D48]/10"}`}
                                    >
                                      {order.source}
                                    </span>
                                  </td>
                                  <td className="p-3 text-xs font-semibold text-[#000000] text-right">
                                    {order.items.reduce(
                                      (sum, i) => sum + i.qty,
                                      0,
                                    )}{" "}
                                    pcs
                                  </td>
                                  <td className="p-3 text-xs font-black text-[#FF0000] text-right">
                                    ₹{order.grandTotal.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Channel Split & Top items */}
                  <div className="col-span-4 w-full flex flex-col gap-6">
                    {/* Today's Channel Split Card */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
                      <h3 className="font-bold text-[#000000] mb-4 text-sm">
                        Today's Channel Split
                      </h3>
                      {todayOrdersCount === 0 ? (
                        <div className="text-center text-[#000000] text-xs font-semibold py-6">
                          No sales today.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-wider w-14">
                              Offline
                            </span>
                            <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#E11D48] rounded-full transition-all duration-700"
                                style={{
                                  width: `${(todayOfflineOrdersCount / todayOrdersCount) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-[#000000] w-12 text-right">
                              ₹{todayOfflineRevenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#00A86B] uppercase tracking-wider w-14">
                              Online
                            </span>
                            <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#00A86B] rounded-full transition-all duration-700"
                                style={{
                                  width: `${(todayOnlineOrdersCount / todayOrdersCount) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-[#000000] w-12 text-right">
                              ₹{todayOnlineRevenue.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Today's Top Products Sold Card */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex-1">
                      <h3 className="font-bold text-[#000000] text-sm mb-4">
                        Today's Top Items
                      </h3>
                      {todayTopItems.length === 0 ? (
                        <div className="text-center text-[#000000] text-xs font-semibold py-6">
                          No items sold today.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {todayTopItems.map((item, idx) => (
                            <div
                              key={item.name}
                              className="flex items-center gap-3"
                            >
                              <span className="text-[11px] font-black text-[#000000] w-4">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-[#000000]">
                                    {item.name}
                                  </span>
                                  <span className="text-xs font-black text-[#FF0000]">
                                    ₹{item.revenue.toLocaleString()}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#FF0000] rounded-full transition-all duration-700"
                                    style={{
                                      width: `${(item.revenue / todayTopItems[0].revenue) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <span className="text-[10px] text-[#000000] font-semibold w-10 text-right">
                                {item.qty} pcs
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {analyticsSubTab === "revenue" && (
              <>
                {/* Top 5x2 KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Row 1 */}
                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Revenue
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3 text-[#10B981] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{totalRevenueAmount.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      POS + manual combined
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Completed Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-[#10B981] animate-swing" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {totalOrdersCount}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      POS + manual bills
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Offline Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#06B6D4]/10 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3 text-[#06B6D4] animate-bounce" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{offlineRevenue.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Walk-in POS sales
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Online Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                        <IndianRupee className="w-3 h-3 text-[#6366F1] animate-float" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{onlineRevenue.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Online POS sales
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {/* Row 2 */}
                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Offline Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#E11D48]/10 flex items-center justify-center">
                        <ShoppingBag className="w-3 h-3 text-[#E11D48] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {offlineOrders}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Walk-in POS orders
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Online Bills
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#6366F1]/10 flex items-center justify-center">
                        <Globe className="w-3 h-3 text-[#6366F1] animate-float" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {onlineOrders}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Online channel orders
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Items Sold
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
                        <Package className="w-3 h-3 text-[#8B5CF6] animate-pop" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      {totalItemsSold}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      From completed bills
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Avg Order Value
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-[#F97316] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xl font-black text-[#000000] mb-1">
                      ₹{Math.round(avgOrderValue).toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Per completed order
                    </div>
                  </div>

                  <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Top Product
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#EC4899]/10 flex items-center justify-center">
                        <Trophy className="w-3 h-3 text-[#EC4899] animate-pop" />
                      </div>
                    </div>
                    <div
                      className="text-xl font-black text-[#000000] mb-1 truncate"
                      title={topProduct}
                    >
                      {topProduct}
                    </div>
                    <div className="text-[9px] text-[#000000] font-semibold">
                      Most sold item
                    </div>
                  </div>
                </div>

                {/* Main Charts & Breakdowns */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
                  {/* Left Chart Column */}
                  <div className="col-span-8 w-full flex flex-col gap-6">
                    {/* Monthly Revenue Trend Chart */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[300px]">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="font-bold text-[#000000] text-sm mb-2 flex items-center">
                            Revenue Trend This Year <span className="text-[#FF0000] font-black ml-1.5">{now.getFullYear()}</span>
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-[#000000]">
                              ₹{totalYearRevenue.toLocaleString()}
                            </span>
                            {avgMonthRevenue > 0 && (
                              <span className="bg-[#FFFFFF] border border-black/10 text-[#FF0000] px-2 py-0.5 rounded text-[10px] font-bold">
                                Avg ₹
                                {Math.round(avgMonthRevenue).toLocaleString()}
                                /mo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {orders.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-[#000000] text-sm font-semibold">
                          Process orders to see yearly revenue trend.
                        </div>
                      ) : (
                        <div className="flex-1 overflow-x-auto scrollbar-thin pb-2">
                          <div className="flex items-end justify-between px-2 gap-1 relative mt-4 min-w-[500px] h-[170px] pt-10">
                            {monthNames.map((month, i) => (
                              <div
                                key={month}
                                className="flex flex-col items-center gap-1.5 w-full group/bar relative outline-none"
                                tabIndex={0}
                              >
                                {/* Monthly sales text on top for mobile/visibility */}
                                <span className="text-[8px] font-black text-[#FF0000] h-3 flex items-end">
                                  {monthRevenue[i] > 0
                                    ? monthRevenue[i] >= 1000
                                      ? `₹${(monthRevenue[i] / 1000).toFixed(1)}k`
                                      : `₹${monthRevenue[i]}`
                                    : ""}
                                </span>

                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#000000] text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 group-focus/bar:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                                  <div className="text-[9px] text-white/70 font-semibold mb-0.5">
                                    {monthNames[i]}
                                  </div>
                                  ₹{(monthRevenue[i] || 0).toLocaleString()}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#000000]"></div>
                                </div>
                                <div
                                  className="w-full max-w-[24px] bg-[#FF0000] rounded-t-sm transition-all duration-1000 group-hover/bar:bg-[#EF4444] cursor-pointer min-h-[4px]"
                                  style={{
                                    height: `${Math.max(4, (monthRevenue[i] / maxMonthRevenue) * 100)}px`,
                                  }}
                                />
                                <span className="text-[10px] font-bold text-[#000000] uppercase">
                                  {month}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Weekly Revenue Bar Chart */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col min-h-[250px]">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="font-bold text-[#000000] text-sm flex items-center">
                            Revenue This Week <span className="text-[#FF0000] font-black ml-1.5">(Week {currentWeekNumber} of {now.getFullYear()})</span>
                          </h3>
                          <p className="text-[10px] text-[#000000] font-semibold mt-1">
                            ₹
                            {weekRevenue
                              .reduce((a, b) => a + b, 0)
                              .toLocaleString()}{" "}
                            total
                          </p>
                        </div>
                      </div>

                      {orders.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-[#000000] text-sm font-semibold">
                          Process orders to see weekly revenue.
                        </div>
                      ) : (
                        <div className="flex-1 flex items-end justify-between px-2 gap-2">
                          {dayNames.map((day, i) => (
                            <div
                              key={day}
                              className="flex flex-col items-center gap-3 w-full group/bar relative outline-none"
                              tabIndex={0}
                            >
                              <span className="text-[9px] font-black text-[#FF0000]">
                                {weekRevenue[i] > 0
                                  ? `₹${weekRevenue[i] >= 1000 ? (weekRevenue[i] / 1000).toFixed(1) + "k" : weekRevenue[i]}`
                                  : ""}
                              </span>

                              {/* Tooltip for exact weekly revenue */}
                              <div className="absolute bottom-[52px] mb-2 left-1/2 -translate-x-1/2 bg-[#000000] text-white text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 group-focus/bar:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                                <div className="text-[9px] text-white/70 font-semibold mb-0.5">
                                  {dayNames[i]}
                                </div>
                                ₹{(weekRevenue[i] || 0).toLocaleString()}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#000000]"></div>
                              </div>

                              <div className="w-full max-w-[20px] h-32 bg-[#F3F4F6] rounded-full relative overflow-hidden cursor-pointer">
                                <div
                                  className="absolute bottom-0 w-full bg-[#FF0000] rounded-full transition-all duration-1000 group-hover/bar:bg-[#EF4444]"
                                  style={{
                                    height: `${(weekRevenue[i] / maxWeekRevenue) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-[#000000] uppercase">
                                {day}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Breakdowns) */}
                  <div className="col-span-4 w-full flex flex-col gap-6">
                    {/* Order Source Breakdown */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                      <h3 className="font-bold text-[#000000] mb-4 text-sm">
                        Order Source
                      </h3>
                      {totalOrdersCount === 0 ? (
                        <div className="text-center text-[#000000] text-sm font-semibold py-6">
                          No orders yet.
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-wider w-14">
                              Offline
                            </span>
                            <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#E11D48] rounded-full transition-all duration-700"
                                style={{
                                  width: `${(offlineOrders / totalOrdersCount) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-[#000000] w-8 text-right">
                              {offlineOrders}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-[#00A86B] uppercase tracking-wider w-14">
                              Online
                            </span>
                            <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#00A86B] rounded-full transition-all duration-700"
                                style={{
                                  width: `${(onlineOrders / totalOrdersCount) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-[#000000] w-8 text-right">
                              {onlineOrders}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Top Items by Revenue */}
                    <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex-1">
                      <h3 className="font-bold text-[#000000] text-sm mb-4">
                        Top Items by Revenue
                      </h3>
                      {topItems.length === 0 ? (
                        <div className="text-center text-[#000000] text-sm font-semibold py-6">
                          No items sold yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {topItems.map((item, idx) => (
                            <div
                              key={item.name}
                              className="flex items-center gap-3"
                            >
                              <span className="text-[11px] font-black text-[#000000] w-4">
                                {idx + 1}
                              </span>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-xs font-bold text-[#000000]">
                                    {item.name}
                                  </span>
                                  <span className="text-xs font-black text-[#FF0000]">
                                    ₹{item.revenue.toLocaleString()}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#FF0000] rounded-full transition-all duration-700"
                                    style={{
                                      width: `${(item.revenue / topItems[0].revenue) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <span className="text-[10px] text-[#000000] font-semibold w-10 text-right">
                                {item.qty} pcs
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {analyticsSubTab === "products" && (
              <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h3 className="font-bold text-[#000000] text-sm">
                    Product Sales Leaderboard
                  </h3>

                  {/* Product Search Input */}
                  <div className="flex items-center border border-black/10 bg-[#FFFFFF] rounded-lg px-3 py-1.5 gap-2 shadow-xs w-full sm:w-auto animate-in fade-in duration-200">
                    <Search className="w-3.5 h-3.5 text-[#000000]" />
                    <input
                      type="text"
                      placeholder="Search product..."
                      className="text-xs font-semibold bg-transparent border-none outline-none focus:ring-0 text-[#000000] placeholder:text-[#000000]/50 w-full sm:w-[180px]"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {Object.keys(itemSales).length === 0 ? (
                  <div className="text-center text-[#000000] text-sm font-semibold py-12">
                    No products sold in this period.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FFFFFF] border-b border-black/10">
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                            Qty Sold
                          </th>
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                            Revenue
                          </th>
                          <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                            Market Share
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(itemSales).filter((item) =>
                          item.name
                            .toLowerCase()
                            .includes(productSearchQuery.toLowerCase()),
                        ).length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center py-12 text-sm font-semibold text-[#000000]"
                            >
                              No matching products found.
                            </td>
                          </tr>
                        ) : (
                          Object.values(itemSales)
                            .filter((item) =>
                              item.name
                                .toLowerCase()
                                .includes(productSearchQuery.toLowerCase()),
                            )
                            .sort((a, b) => b.revenue - a.revenue)
                            .map((item, idx) => {
                              const share =
                                totalRevenueAmount > 0
                                  ? (item.revenue / totalRevenueAmount) * 100
                                  : 0;
                              return (
                                <tr
                                  key={item.name}
                                  className="border-b border-transparent hover:bg-[#FFFFFF]/50 transition-colors"
                                >
                                  <td className="p-3 text-xs font-black text-[#000000]">
                                    {idx + 1}
                                  </td>
                                  <td className="p-3 text-xs font-bold text-[#000000]">
                                    {item.name}
                                  </td>
                                  <td className="p-3 text-xs font-bold text-[#000000] text-right">
                                    {item.qty} pcs
                                  </td>
                                  <td className="p-3 text-xs font-black text-[#FF0000] text-right">
                                    ₹{item.revenue.toLocaleString()}
                                  </td>
                                  <td className="p-3 w-1/4">
                                    <div className="flex items-center gap-3">
                                      <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-[#FF0000] rounded-full"
                                          style={{ width: `${share}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] font-bold text-[#000000] w-8">
                                        {share.toFixed(1)}%
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {analyticsSubTab === "coupons" && (
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
                <div className="col-span-1 w-full bg-white border border-black/10 rounded-xl p-6 shadow-sm flex flex-col gap-6">
                  <h3 className="font-bold text-[#000000] text-sm">
                    Discount Summary
                  </h3>

                  <div className="p-4 bg-[#FFFFFF] border border-black/10 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Total Discounts Given
                      </span>
                      <Percent className="w-4 h-4 text-[#FF0000]" />
                    </div>
                    <span className="text-2xl font-black text-[#FF0000]">
                      ₹
                      {analyticsFilteredOrders
                        .reduce((acc, o) => acc + o.discount, 0)
                        .toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 bg-[#FFFFFF] border border-black/10 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Discounted Orders
                      </span>
                      <Calendar className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <span className="text-2xl font-black text-[#000000]">
                      {
                        analyticsFilteredOrders.filter((o) => o.discount > 0)
                          .length
                      }
                    </span>
                  </div>

                  <div className="p-4 bg-[#FFFFFF] border border-black/10 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000000]">
                        Avg Discount Per Order
                      </span>
                      <IndianRupee className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <span className="text-2xl font-black text-[#000000]">
                      ₹
                      {Math.round(
                        analyticsFilteredOrders.filter((o) => o.discount > 0)
                          .length > 0
                          ? analyticsFilteredOrders.reduce(
                              (acc, o) => acc + o.discount,
                              0,
                            ) /
                              analyticsFilteredOrders.filter(
                                (o) => o.discount > 0,
                              ).length
                          : 0,
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 w-full bg-white border border-black/10 rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="font-bold text-[#000000] text-sm">
                      Promo Campaign Performance
                    </h3>

                    {/* Coupons Search Input */}
                    <div className="flex items-center border border-black/10 bg-[#FFFFFF] rounded-lg px-3 py-1.5 gap-2 shadow-xs w-full sm:w-auto animate-in fade-in duration-200">
                      <Search className="w-3.5 h-3.5 text-[#000000]" />
                      <input
                        type="text"
                        placeholder="Search code/mobile/amount..."
                        className="text-xs font-semibold bg-transparent border-none outline-none focus:ring-0 text-[#000000] placeholder:text-[#000000]/50 w-full sm:w-[220px]"
                        value={couponSearchQuery}
                        onChange={(e) => setCouponSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {analyticsFilteredOrders.filter((o) => o.discount > 0).length ===
                  0 ? (
                    <div className="text-center text-[#000000] text-sm font-semibold py-12">
                      No promotional discounts given in this period.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FFFFFF] border-b border-black/10">
                            <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                              Transaction ID
                            </th>
                            <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider">
                              Customer Mobile
                            </th>
                            <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                              Order Total
                            </th>
                            <th className="p-3 text-[10px] font-bold text-[#000000] uppercase tracking-wider text-right">
                              Discount Applied
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsFilteredOrders
                            .filter((o) => o.discount > 0)
                            .filter((o) => {
                              const q = couponSearchQuery.toLowerCase();
                              const couponCode = getCouponCodeForOrder(o).toLowerCase();
                              return (
                                o.id.toLowerCase().includes(q) ||
                                couponCode.includes(q) ||
                                (o.customerPhone || "").includes(q) ||
                                o.discount.toString().includes(q) ||
                                o.grandTotal.toString().includes(q)
                              );
                            }).length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                className="text-center py-12 text-sm font-semibold text-[#000000]"
                              >
                                No matching coupon performance records found.
                              </td>
                            </tr>
                          ) : (
                            analyticsFilteredOrders
                              .filter((o) => o.discount > 0)
                              .filter((o) => {
                                const q = couponSearchQuery.toLowerCase();
                                const couponCode = getCouponCodeForOrder(o).toLowerCase();
                                return (
                                  o.id.toLowerCase().includes(q) ||
                                  couponCode.includes(q) ||
                                  (o.customerPhone || "").includes(q) ||
                                  o.discount.toString().includes(q) ||
                                  o.grandTotal.toString().includes(q)
                                );
                              })
                              .map((order) => (
                                <tr
                                  key={order.id}
                                  className="border-b border-transparent hover:bg-[#FFFFFF]/50 transition-colors"
                                >
                                  <td className="p-3 text-xs font-semibold text-[#000000]">
                                    {order.id}
                                  </td>
                                  <td className="p-3 text-xs font-mono font-bold text-[#000000]">
                                    {order.customerPhone || "-"}
                                  </td>
                                  <td className="p-3 text-xs font-bold text-right text-[#000000]">
                                    ₹{order.grandTotal.toLocaleString()}
                                  </td>
                                  <td className="p-3 text-xs font-black text-[#E11D48] text-right">
                                    -₹{order.discount.toLocaleString()}
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-black/10 flex justify-between items-center bg-[#FFFFFF]">
                <div>
                  <h3 className="text-xl font-bold text-[#000000]">
                    Order Details
                  </h3>
                  <p className="text-sm text-[#000000] font-medium mt-1">
                    {selectedOrder.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-black/10 rounded-full transition-colors group cursor-pointer"
                >
                  <X className="w-5 h-5 text-[#000000] group-hover:text-[#FF0000] transition-colors" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-[10px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                      Customer Name
                    </div>
                    <div className="text-sm font-semibold text-[#000000]">
                      {selectedOrder.customerName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                      Contact Number
                    </div>
                    <div className="text-sm font-semibold text-[#000000]">
                      {selectedOrder.customerPhone || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                      Order Source
                    </div>
                    <div className="text-sm font-semibold text-[#000000]">
                      {selectedOrder.source}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#000000] uppercase tracking-wider mb-1">
                      Date & Time
                    </div>
                    <div className="text-sm font-semibold text-[#000000]">
                      {new Date(selectedOrder.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mb-4 text-[11px] font-bold text-[#000000] uppercase tracking-[0.1em] border-b border-black/10 pb-2">
                  Order Items
                </div>
                <div className="space-y-3 mb-8">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <div className="text-sm font-bold text-[#000000]">
                          {item.name}
                        </div>
                        {item.desc && (
                          <div className="text-[10px] text-[#000000] font-medium">
                            {item.desc}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#000000]">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#000000] font-medium">
                          {item.qty} x ₹{item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#000000] font-semibold">
                      Subtotal
                    </span>
                    <span className="text-[#000000] font-bold">
                      ₹{selectedOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#000000] font-semibold">
                        Discount
                      </span>
                      <span className="text-[#E11D48] font-bold">
                        -₹{selectedOrder.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedOrder.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#000000] font-semibold">
                        Delivery Fee
                      </span>
                      <span className="text-[#000000] font-bold">
                        ₹{selectedOrder.deliveryFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg pt-2 mt-2 border-t border-transparent">
                    <span className="text-[#000000] font-black uppercase tracking-tight">
                      Total{" "}
                    </span>
                    <span className="text-[#FF0000] font-black">
                      ₹{selectedOrder.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Classy Footer */}
        <footer className="mt-auto pt-10 pb-2 border-t border-black/10 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#000000] font-semibold uppercase tracking-wider gap-4">
          <div className="text-[#000000]">
            © 2026 All Rights Reserved. KFC.
          </div>
          <div>
            Powered By{" "}
            <a
              href="https://www.cenexasystems.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF0000] hover:underline font-bold transition-all"
            >
              Cenexa Systems
            </a>{" "}
            @2026
          </div>
          <div className="italic text-[#4B5563] font-bold tracking-[0.15em] flex items-center gap-1.5">
            <span className="w-1 h-1 bg-[#DC2626] rounded-full"></span>
            Fresh. Crispy. Delicious.
          </div>
        </footer>
      </main>
    </div>
  );
}
