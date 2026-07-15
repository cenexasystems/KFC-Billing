import { ShoppingBag, MapPin, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FCFCFA] text-[#32231A] font-sans flex flex-col justify-between selection:bg-[#8C1D2F] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#E8DEC8]/50 py-6 px-6 sm:px-12 flex justify-center items-center bg-white/60 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#8C1D2F] rounded-xl flex items-center justify-center shadow-md">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-black text-[#192836] tracking-wider uppercase block">
              UPDATE Men's Wear
            </span>
            <span className="text-[9px] text-[#8C1D2F] font-bold tracking-widest block uppercase -mt-0.5">
              Premium Tailoring & Menswear
            </span>
          </div>
        </div>
      </header>

      {/* Main Info */}
      <main className="flex-1 max-w-xl mx-auto w-full px-6 flex flex-col justify-center items-center py-16">
        <div className="bg-white border border-[#E8DEC8] rounded-2xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#8C1D2F]" />
          
          <span className="inline-block px-3 py-1 bg-[#8C1D2F]/10 border border-[#8C1D2F]/20 text-[#8C1D2F] text-[10px] font-bold rounded-full tracking-wider uppercase mb-6">
            Store Directory & Contacts
          </span>
          
          <h1 className="text-3xl font-black text-[#192836] leading-tight tracking-tight mb-2">
            Update Men's Wear
          </h1>
          <p className="text-xs text-[#8C1D2F] font-black tracking-widest uppercase mb-8">
            Tailoring & Custom Menswear
          </p>

          <div className="space-y-6 text-left max-w-sm mx-auto text-sm font-semibold text-[#4C3D32] border-t border-[#E8DEC8]/50 pt-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#8C1D2F] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-[#8A7B72]/85 uppercase tracking-wider mb-0.5">Address</p>
                <p className="text-[#32231A] leading-relaxed">
                  131, Eldams Rd, Teynampet, Chennai, Tamil Nadu 600018
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#8C1D2F] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-[#8A7B72]/85 uppercase tracking-wider mb-0.5">Business Hours</p>
                <p className="text-[#32231A]">
                  Open Daily: 10:00 AM - 9:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8DEC8]/50 py-6 text-center bg-[#F8F5F0]">
        <p className="text-[10px] font-bold text-[#8C1D2F] tracking-widest uppercase">
          Update Men's Wear • Chennai
        </p>
        <p className="text-[9px] font-semibold text-[#8A7B72]/85 uppercase tracking-wider mt-1">
          © {new Date().getFullYear()} All Rights Reserved • Powered by Cenexa Systems
        </p>
      </footer>
    </div>
  );
}
