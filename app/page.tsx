import { ShoppingBag, MapPin, Clock, Phone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F0E1] text-[#000000] font-sans flex flex-col justify-between selection:bg-[#FCD814] selection:text-black">
      {/* Header */}
      <header className="border-b border-[#e5e5e5]/50 py-6 px-6 sm:px-12 flex justify-center items-center bg-white/60 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFFFFF] rounded-xl flex items-center justify-center shadow-md p-1 border border-black/10">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-sm font-black text-[#E60000] tracking-wider uppercase block">
              Korean Fried Chicken
            </span>
            <span className="text-[9px] text-[#B48600] font-bold tracking-widest block uppercase -mt-0.5">
              Premium Fried Chicken & Beverages
            </span>
          </div>
        </div>
      </header>

      {/* Main Info */}
      <main className="flex-1 max-w-xl mx-auto w-full px-6 flex flex-col justify-center items-center py-16">
        <div className="bg-[#FAF7F0] border border-[#e5e5e5] rounded-2xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FCD814]" />
          
          <span className="inline-block px-3 py-1 bg-[#FCD814]/20 border border-[#FCD814]/30 text-[#9A7300] text-[10px] font-bold rounded-full tracking-wider uppercase mb-6">
            Store Directory & Contacts
          </span>
          
          <h1 className="text-3xl font-black text-[#E60000] leading-tight tracking-tight mb-2">
            Korean Fried Chicken
          </h1>
          <p className="text-xs text-[#B48600] font-black tracking-widest uppercase mb-8">
            Fried Chicken & Beverages
          </p>

          <div className="space-y-6 text-left max-w-sm mx-auto text-sm font-semibold text-[#4C3D32] border-t border-[#e5e5e5]/50 pt-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#B48600] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-[#666666]/85 uppercase tracking-wider mb-0.5">Address</p>
                <p className="text-[#000000] leading-relaxed">
                  Nanjappa Garden Selvapuram, Shivalaya Mahal road, SBI Bank Opposite, Komarapalayam, Combatore.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[#B48600] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-[#666666]/85 uppercase tracking-wider mb-0.5">Phone Number</p>
                <p className="text-[#000000]">
                  +91 9342489391
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#B48600] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-[#666666]/85 uppercase tracking-wider mb-0.5">Business Hours</p>
                <p className="text-[#000000]">
                  Open Daily: 10:00 AM - 9:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5]/50 py-6 text-center bg-[#EAE3CD]">
        <p className="text-[10px] font-bold text-[#B48600] tracking-widest uppercase">
          Korean Fried Chicken • Coimbatore
        </p>
        <p className="text-[9px] font-semibold text-[#666666]/85 uppercase tracking-wider mt-1">
          © {new Date().getFullYear()} All Rights Reserved • Powered by Cenexa Systems
        </p>
      </footer>
    </div>
  );
}
