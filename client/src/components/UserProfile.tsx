import { useUser } from "../hooks/useUser.tsx";

interface UserProfileProps {
  username: string;
}

export default function UserProfile({ username }: UserProfileProps) {
  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(/[^a-zA-Z0-9]/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(username);

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:block text-right">
        <p className="text-cyber-text text-sm">{username}</p>
        <p className="text-cyber-dark-text text-xs font-mono">SYSTEM::AUTHENTICATED</p>
      </div>
      <div className="relative">
        <div className="w-9 h-9 rounded-full bg-cyber-surface border border-cyber-primary/50 flex items-center justify-center overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-primary/20 to-cyber-secondary/20 flex items-center justify-center text-sm font-bold text-cyber-text uppercase">
            {initials}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-cyber-surface"></div>
      </div>
    </div>
  );
}
