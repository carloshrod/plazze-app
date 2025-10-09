"use client";

import { Button } from "antd";

export const ScrollToBookingButton = () => {
  const scrollToBooking = () => {
    if (typeof document !== "undefined") {
      document.getElementById("booking-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className="mt-8 block md:hidden">
      <Button type="primary" size="large" block onClick={scrollToBooking}>
        Reservar ahora
      </Button>
    </div>
  );
};
