import { useState, useEffect } from "react";
import { toast } from "sonner";
import { authServices } from "../../lib/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authServices.getAuthenticatUser();
        setIsLoggedIn(!!session?.tokens?.idToken); // Check for idToken to align with Login component
      } catch (err) {
        console.error("Auth Check Error:", err);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Logout function
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authServices.logout();
      localStorage.removeItem("idToken"); // Clear idToken to align with Login component
      setIsLoggedIn(false);
      toast.success("You have been logged out successfully.");
      router.push("/");
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <header className="flex justify-end items-end px-10 py-2 shadow-md dark:bg-white/10 dark:border-stone-50/30 bg-black/10 border-stone-500/30 border-b">
      <div className="flex items-center justify-end gap-10">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.location.reload()}>
                Refresh
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth/pages/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to log out?</p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoggingOut}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Logging out...
                  </span>
                ) : (
                  "Logout"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Header;