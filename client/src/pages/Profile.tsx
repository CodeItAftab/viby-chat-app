import { ArrowLeft, Mail, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/auth";

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-background p-4 pb-24 sm:p-6 sm:pb-24 lg:p-10 lg:pb-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="border-border/60 bg-card/80 shadow-xl shadow-primary/5">
          <CardHeader className="flex flex-row items-center gap-5 border-b border-border/60 p-6 sm:p-8">
            <Avatar className="h-20 w-20 ring-4 ring-primary/15">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-xl font-bold text-white">
                {getInitials(user?.name || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate text-2xl">
                {user?.name || "User"}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                @{user?.username || "username"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </div>
              <p className="break-all text-foreground">
                {user?.email || "Not available"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <UserRound className="h-4 w-4 text-primary" />
                Username
              </div>
              <p className="text-foreground">
                {user?.username || "Not available"}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Bio
              </p>
              <p className="whitespace-pre-wrap text-foreground">
                {user?.bio || "No bio added yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
