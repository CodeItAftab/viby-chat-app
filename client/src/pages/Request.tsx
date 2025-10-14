import { UserCheck, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ReceivedRequestCard } from "@/components/request/received-request-card";
import { SentRequestCard } from "@/components/request/sent-request-card";
// import type { FriendRequest } from "@/types";
import { useState } from "react";
import {
  useGetReceivedRequestsQuery,
  useGetSentRequestsQuery,
} from "@/store/api/viby";

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  const { data: receivedRequests = [] } = useGetReceivedRequestsQuery();
  const { data: sentRequests = [] } = useGetSentRequestsQuery();

  const onTabChange = (tab: "received" | "sent") => {
    setActiveTab(tab);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-800/20 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-4 sm:p-5 lg:p-6 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  Friend Requests
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Manage your friend requests
                </p>
              </div>
            </div>

            {/* Stats/Tab Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto lg:max-w-none">
              <Card
                className={`p-3 cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                  activeTab === "received"
                    ? "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/30 border-emerald-200/60 dark:border-emerald-700/60 shadow-md ring-1 ring-emerald-200/30 dark:ring-emerald-700/30"
                    : "bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-sm"
                }`}
                onClick={() => onTabChange("received")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeTab === "received"
                        ? "bg-gradient-to-br from-emerald-500/20 to-green-500/20 dark:from-emerald-400/20 dark:to-green-400/20"
                        : "bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-400/10 dark:to-green-400/10 group-hover:from-emerald-500/15 group-hover:to-green-500/15"
                    }`}
                  >
                    <UserCheck
                      className={`w-5 h-5 transition-all duration-300 ${
                        activeTab === "received"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-emerald-500 dark:text-emerald-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium transition-colors duration-300 ${
                        activeTab === "received"
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Received
                    </p>
                    <p
                      className={`text-xl font-bold transition-colors duration-300 ${
                        activeTab === "received"
                          ? "text-emerald-800 dark:text-emerald-200"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {receivedRequests.length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                className={`p-3 cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                  activeTab === "sent"
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/30 border-amber-200/60 dark:border-amber-700/60 shadow-md ring-1 ring-amber-200/30 dark:ring-amber-700/30"
                    : "bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:shadow-sm"
                }`}
                onClick={() => onTabChange("sent")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeTab === "sent"
                        ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 dark:from-amber-400/20 dark:to-orange-400/20"
                        : "bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-400/10 dark:to-orange-400/10 group-hover:from-amber-500/15 group-hover:to-orange-500/15"
                    }`}
                  >
                    <Send
                      className={`w-5 h-5 transition-all duration-300 ${
                        activeTab === "sent"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-amber-500 dark:text-amber-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium transition-colors duration-300 ${
                        activeTab === "sent"
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Sent
                    </p>
                    <p
                      className={`text-xl font-bold transition-colors duration-300 ${
                        activeTab === "sent"
                          ? "text-amber-800 dark:text-amber-200"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {sentRequests.length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="space-y-2.5 max-w-2xl mx-auto">
                {activeTab === "received" ? (
                  receivedRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200/60 dark:border-emerald-700/60">
                        <UserCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        No friend requests
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        You don't have any pending friend requests.
                      </p>
                    </div>
                  ) : (
                    receivedRequests.map((request) => (
                      <ReceivedRequestCard
                        key={request._id}
                        request={request}
                      />
                    ))
                  )
                ) : sentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/60 dark:border-amber-700/60">
                      <Send className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      No sent requests
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      You haven't sent any friend requests yet.
                    </p>
                  </div>
                ) : (
                  sentRequests.map((request) => (
                    <SentRequestCard key={request._id} request={request} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
