"use client";

import { useAccount, useDisconnect, useBalance } from "wagmi";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const CustomConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isConnected) {
      router.push("/home");
    } else {
      router.push("/landing");
    }
  }, [isConnected, router]);

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <Button
        onClick={openConnectModal}
        className="px-6 py-3 border border-cyan-500 text-cyan-500 rounded-md
                  transition-all duration-300 hover:shadow-[0_0_12px_#00FFFF]"
        type="button"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className="px-6 py-3 border border-cyan-500 text-cyan-500 rounded-md
                     transition-all duration-300 hover:shadow-[0_0_12px_#00FFFF]"
        >
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-black border border-cyan-500 rounded-md p-2 w-64"
      >
        <div className="text-white text-sm px-3 py-2 flex justify-between items-center">
          <span className="truncate">{address}</span>
          <button onClick={copyToClipboard} className="text-cyan-400 text-xs">
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>
        <div className="border-t border-gray-700 my-2" />

        <div className="text-white text-sm px-3 py-2">
          Solde:{" "}
          {balance ? `${balance.formatted} ${balance.symbol}` : "Chargement..."}
        </div>
        <div className="border-t border-gray-700 my-2" />

        <DropdownMenuItem
          onClick={() => {
            setIsMenuOpen(false);
            setTimeout(() => {
              openConnectModal?.();
            }, 100);
          }}
          className="cursor-pointer !text-cyan-300 hover:!text-cyan-600 hover:bg-transparent focus:bg-transparent"
        >
          Changer de compte
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            disconnect();
            setIsMenuOpen(false);
          }}
          className="cursor-pointer !text-pink-500 hover:!text-pink-800 hover:bg-transparent focus:bg-transparent"
        >
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomConnectButton;
