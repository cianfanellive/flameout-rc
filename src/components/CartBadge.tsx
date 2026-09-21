"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, onCartChange } from "@/lib/cart";
import { CartIcon } from "./icons";

export function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCart().length);
    return onCartChange(() => setCount(getCart().length));
  }, []);

  return (
    <Link href="/cart" className="relative flex items-center text-chrome-300 transition hover:text-flame-400" aria-label="Cart">
      <CartIcon className="h-6 w-6" />
      {count > 0 ? (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-flame-500 px-1 font-display text-[10px] text-asphalt-950">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
