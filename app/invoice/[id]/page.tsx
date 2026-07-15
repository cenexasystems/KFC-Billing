"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, MapPin, Phone, Printer, Copy, Check, Home, Building2 } from "lucide-react";
import Link from "next/link";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error: dbError } = await supabase
        .from('orders')
        .select(`
          *,
          customers(name, phone),
          order_items (*)
        `)
        .eq('id', id)
        .single();

      if (dbError || !data) {
        setError(true);
      } else {
        setOrder(data);
        document.title = `Invoice - ${data.id}`;
      }
      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-[#FCD814] rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <p className="text-[#4C3D32] font-bold tracking-widest uppercase text-sm">Generating Digital Bill...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center gap-4">
        <p className="text-[#FCD814] font-bold text-xl">Invoice Not Found</p>
        <Link href="/" className="px-6 py-2 bg-[#e5e5e5] hover:bg-[#DBCABF] rounded-lg text-[#000000] font-bold transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAFAEB] text-[#000000] font-sans py-12 px-4 print:p-0 print:bg-white flex flex-col items-center">
      <style>{`
        @media print {
          @page {
            margin: 10mm;
          }
          body {
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
      
      {/* Top Navigation / Action Bar (Hidden when printing) */}
      <div className="w-full max-w-3xl flex justify-end items-center mb-8 print:hidden gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 bg-white hover:bg-[#F0EBE1]/40 text-[#4C3D32] hover:text-[#FCD814] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-lg shadow-sm border border-[#e5e5e5] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Link
              </>
            )}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#FCD814] hover:bg-[#6B1422] text-black font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Download PDF / Print
          </button>
        </div>
      </div>

      {/* The Invoice Document */}
      <div className="w-full max-w-3xl bg-white border border-[#e5e5e5] rounded-2xl shadow-xl print:shadow-none print:border-none print:rounded-none overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#ffffff] border-b border-[#e5e5e5] p-8 sm:p-12 print:p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 flex items-center justify-center mb-4">
            <img src="/logo.png" alt="Korean Fried Chicken Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-[#E60000] tracking-tight ">Korean Fried Chicken</h1>
            <p className="text-xs text-[#FCD814] font-bold tracking-wider mt-1 mb-4">INVOICE: {order.id}</p>
          
          <div className="flex flex-col items-center gap-2 text-sm text-[#4C3D32] font-semibold">
            <div className="text-center max-w-md leading-relaxed">
              <span className="inline-block text-[#FCD814] mr-1.5 align-middle -mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span>Nanjappa Garden Selvapuram, Shivalaya Mahal road, SBI Bank Opposite, Komarapalayam, Combatore.</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Phone className="w-3.5 h-3.5 text-[#FCD814] shrink-0" />
              <span>+91 9342489391</span>
            </div>
          </div>
        </div>

        {/* Invoice Meta Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8 sm:p-12 print:p-6 border-b border-[#e5e5e5]/50">
          <div>
            <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-[0.2em] mb-3">Billed To</h3>
            <p className="text-base font-bold text-[#E60000]">{order.customers?.name || "Guest Customer"}</p>
            {order.customers?.phone && (
              <p className="text-sm text-[#4C3D32] font-semibold mt-1">+91 {order.customers.phone.split("_")[0]}</p>
            )}
          </div>
          <div className="sm:text-right flex flex-col sm:items-end">
            <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-[0.2em] mb-3 self-start sm:self-auto">Order Details</h3>
            <div className="inline-block text-left text-sm space-y-1">
              <div className="flex gap-2">
                <span className="text-[#666666] font-bold w-12 text-left sm:text-right">Date:</span>
                <span className="text-[#000000] font-black">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#666666] font-bold w-12 text-left sm:text-right">Time:</span>
                <span className="text-[#000000] font-black">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#666666] font-bold w-12 text-left sm:text-right">Type:</span>
                <span className="text-[#000000] font-black uppercase">{order.source} SALE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-8 sm:p-12 print:py-4 print:px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#e5e5e5]">
                <th className="py-4 text-[11px] font-bold text-[#666666] uppercase tracking-wider">Item Description</th>
                <th className="py-4 text-[11px] font-bold text-[#666666] uppercase tracking-wider text-center">Qty</th>
                <th className="py-4 text-[11px] font-bold text-[#666666] uppercase tracking-wider text-right">Price</th>
                <th className="py-4 text-[11px] font-bold text-[#666666] uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e5e5]/40">
              {order.order_items.map((item: any, index: number) => (
                <tr key={index} className="group">
                  <td className="py-6 pr-4 print:py-3">
                    <p className="text-sm font-bold text-[#E60000]">{item.snapshot_name}</p>
                  </td>
                  <td className="py-6 px-4 print:py-3 text-center text-sm font-bold text-[#4C3D32]">{item.quantity}</td>
                  <td className="py-6 pl-4 print:py-3 text-right text-sm font-bold text-[#4C3D32]">₹{item.snapshot_price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="py-6 pl-4 print:py-3 text-right text-sm font-black text-[#E60000]">₹{(item.snapshot_price * item.quantity).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="bg-[#ffffff] border-t border-[#e5e5e5] p-8 sm:p-12 print:p-6 flex justify-end">

            {/* Calculations */}
            <div className="w-full sm:w-1/2 space-y-3">
              {(order.discount_amount > 0 || order.delivery_fee > 0) && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#666666] font-bold uppercase tracking-wider">Subtotal</span>
                  <span className="font-bold text-[#000000]">₹{order.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}
              
              {order.discount_amount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#666666] font-bold uppercase tracking-wider">
                    Discount {order.discount_type === 'PERCENT' ? `(${order.discount_value}%)` : ''}
                  </span>
                  <span className="font-bold text-[#E11D48]">-₹{order.discount_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}

              {order.delivery_fee > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#666666] font-bold uppercase tracking-wider">Delivery Fee</span>
                  <span className="font-bold text-[#000000]">₹{order.delivery_fee.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              )}

              <div className="border-t border-[#e5e5e5] pt-4 mt-2 flex justify-between items-center">
                <span className="text-sm font-black text-[#FCD814] uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black text-[#E60000]">₹{order.grand_total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-[#e5e5e5]/60 p-6 print:p-4 text-center bg-[#f5f5f5] flex flex-col items-center justify-center gap-1.5">
          <p className="text-xs font-bold text-[#FCD814] tracking-wider uppercase">Thank you for shopping!</p>
          <p className="text-[9px] font-bold text-[#666666]/80 uppercase tracking-[0.15em]">Powered by cenexa system @2026</p>
        </div>

      </div>
    </div>
  );
}
