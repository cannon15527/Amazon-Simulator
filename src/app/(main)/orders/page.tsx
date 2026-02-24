"use client";

import { useOrders } from "@/hooks/use-orders";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { OrderProgress } from "@/components/order-progress";
import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { orders } = useOrders();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  return (
    <div className="flex flex-col gap-8 py-8 md:py-12">
      <div className="text-center">
        <h1 className="font-bold tracking-tight text-4xl md:text-5xl">
          Your Orders
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Track your imaginary packages on their virtual journey.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-16 border-dashed">
          <CardHeader>
            <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No orders yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You haven't placed any virtual orders.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/">Browse Products</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>
                    Order #{order.id.substring(0, 8)}...
                  </CardTitle>
                  <CardDescription>
                    Placed on {format(order.orderDate, "MMMM d, yyyy")}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      order.status === "Delivered" ? "default" : "secondary"
                    }
                    className={
                        order.status === 'Delivered' ? 'bg-green-600 text-white' : order.status === 'Shipped' ? 'bg-blue-500 text-white' : ''
                    }
                  >
                    {order.status}
                  </Badge>
                  <p className="mt-1 font-bold text-lg">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  {order.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-4 py-2"
                    >
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={64}
                        height={48}
                        className="rounded-md object-cover aspect-video"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <OrderProgress order={order} />
              </CardContent>
               <CardFooter className="flex-col items-start bg-muted/50 p-4">
                    <p className="text-sm font-medium">Shipping to:</p>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress.name} - {order.shippingAddress.street}, {order.shippingAddress.city}</p>
               </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
