import {
  MessageCircle,
  Users,
  Phone,
  Plus,
  UserPlus,
  Search,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  activeSection: string;
}

export function EmptyState({ activeSection }: EmptyStateProps) {
  const emptyStates = {
    chats: {
      icon: MessageCircle,
      title: "No conversations yet",
      description: "Start a new chat to begin messaging with your contacts.",
      action: "Start New Chat",
      actionIcon: Plus,
    },
    friends: {
      icon: Users,
      title: "No friends yet",
      description: "Connect with people to build your network.",
      action: "Discover People",
      actionIcon: UserPlus,
    },
    discover: {
      icon: Search,
      title: "Discover new people",
      description: "Search for people to connect with and expand your network.",
      action: "Start Searching",
      actionIcon: Search,
    },
    requests: {
      icon: UserCheck,
      title: "No friend requests",
      description: "Friend requests you send and receive will appear here.",
      action: "Discover People",
      actionIcon: Search,
    },
    calls: {
      icon: Phone,
      title: "No recent calls",
      description:
        "Your call history will appear here once you make or receive calls.",
      action: "Make a Call",
      actionIcon: Phone,
    },
  };

  const state =
    emptyStates[activeSection as keyof typeof emptyStates] || emptyStates.chats;
  const IconComponent = state.icon;

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background">
      <div className="text-center max-w-sm mx-auto px-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20 shadow-xl shadow-blue-500/10">
          <IconComponent className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-3 tracking-tight">
          {state.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 text-sm">
          {state.description}
        </p>
        {state.action && state.actionIcon && (
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40">
            <state.actionIcon className="w-4 h-4 mr-2" />
            {state.action}
          </Button>
        )}
      </div>
    </div>
  );
}
