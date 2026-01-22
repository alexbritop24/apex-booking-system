import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import TopBar from "../components/TopBar";
import { Calendar, Users, Zap, DollarSign } from "lucide-react";

interface Booking {
  id: string;
  clientName: string;
  service: string;
  time: string;
  duration: string;
  status: string;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: "Bookings This Week", value: "24", change: "+12%", icon: Calendar },
    { label: "Revenue", value: "$12,400", change: "+8%", icon: DollarSign },
    { label: "Active Clients", value: "156", change: "+5%", icon: Users },
    { label: "Automation Rate", value: "94%", change: "+2%", icon: Zap },
  ];

  const upcomingBookings = [
    { id: "1", clientName: "Sarah Johnson", service: "Facial Treatment", time: "9:00 AM", duration: "60 min", status: "confirmed" },
    { id: "2", clientName: "Michael Chen", service: "Massage Therapy", time: "11:00 AM", duration: "90 min", status: "confirmed" },
    { id: "3", clientName: "Emma Davis", service: "Consultation", time: "2:00 PM", duration: "30 min", status: "pending" },
    { id: "4", clientName: "James Wilson", service: "Body Treatment", time: "4:00 PM", duration: "120 min", status: "confirmed" }
  ];

  const recentActivity = [
    { type: "booking", message: "New booking from Sarah Johnson", time: "5 min ago" },
    { type: "automation", message: "Reminder sent to 3 clients", time: "12 min ago" },
    { type: "payment", message: "Payment received - $180", time: "25 min ago" },
    { type: "automation", message: "Deposit request sent to Emma Davis", time: "1 hour ago" },
  ];

  useEffect(() => {
    // For now, we'll use static data
    // In the future, fetch from Firestore
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <TopBar title="Dashboard" />

      <div className="flex-1 overflow-auto p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6 hover:border-cyan-400/30 transition-all duration-500 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center group-hover:bg-cyan-400/20 transition-colors duration-500">
                  <stat.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div
                  className={`text-[11px] font-medium ${
                    stat.change.startsWith("+") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
              <div className="text-[28px] font-light text-white mb-1">{stat.value}</div>
              <div className="text-[12px] text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2 bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-light">Upcoming Bookings</h2>
              <button className="text-[12px] text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                View All →
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-neutral-950/50 rounded-lg h-20" />
                ))}
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                No upcoming bookings
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-neutral-950/50 border border-neutral-800/50 rounded-lg p-4 hover:border-cyan-400/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                          <div className="text-[14px] font-medium text-cyan-400">
                            {booking.clientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-white">
                            {booking.clientName}
                          </div>
                          <div className="text-[12px] text-neutral-500">{booking.service}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] text-white">{booking.time}</div>
                        <div className="text-[11px] text-neutral-500">{booking.duration}</div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                          booking.status === "confirmed"
                            ? "bg-green-400/10 text-green-400"
                            : "bg-yellow-400/10 text-yellow-400"
                        }`}
                      >
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6">
            <h2 className="text-[18px] font-light mb-6">Recent Activity</h2>

            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      activity.type === "booking"
                        ? "bg-cyan-400"
                        : activity.type === "automation"
                        ? "bg-purple-400"
                        : "bg-green-400"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="text-[13px] text-white">{activity.message}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}