import React, { useState } from 'react';
import { Settings, AlertTriangle, Users, User, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { useIsMobile } from '@/hooks/use-mobile';
import legalBeeLogo from '@/assets/legal-bee-logo.png';

interface HeaderProps {
  onEmergencyClick?: () => void;
}

export const Header = ({ onEmergencyClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div onClick={() => navigate('/')} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0 flex-1">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <img
                src={legalBeeLogo}
                alt="Legal Bee Logo"
                className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-primary truncate">LEGAL BEE</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Legal Assistant</p>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
            <Button
              onClick={onEmergencyClick}
              variant="outline"
              size={isMobile ? "default" : "icon"}
              className={`border-emergency/20 hover:bg-emergency/5 animate-pulse-glow ${isMobile ? 'px-3 py-2' : 'p-2'}`}
            >
              <AlertTriangle className="h-4 w-4 text-emergency" />
              {isMobile && <span className="ml-2 text-sm font-medium">Emergency</span>}
            </Button>
            <ThemeToggle />
            <Button
              onClick={() => navigate('/lawyers')}
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              className="border-primary/20 hover:bg-primary/5 p-2"
              title="Find Lawyers"
            >
              <Users className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-primary`} />
              {isMobile && <span className="ml-1 text-xs hidden sm:inline">Lawyers</span>}
            </Button>
            {!isMobile && (
              <Button
                variant="outline"
                size="icon"
                className="border-primary/20 hover:bg-primary/5"
                title="Settings"
              >
                <Settings className="h-4 w-4 text-primary" />
              </Button>
            )}

            {/* Authentication */}
            {!user ? (
              <Button
                onClick={() => setAuthModalOpen(true)}
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                className="border-primary/20 hover:bg-primary/5 p-2"
                title="Sign In"
                disabled={loading}
              >
                <LogIn className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-primary`} />
                {isMobile && <span className="ml-1 text-xs">Sign In</span>}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {getInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Signed in</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/lawyers')}>
                    <Users className="mr-2 h-4 w-4" />
                    Find Lawyers
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
