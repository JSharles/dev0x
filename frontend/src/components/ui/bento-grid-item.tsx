"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export const BentoGridItem = ({
  className,
  title,
  description,
  imageUrl,
  icon,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  imageUrl?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      className={cn(
        "relative row-span-1 rounded-xl group transition duration-200 border border-cyan-700 flex flex-col",
        "hover:shadow-[0px_0px_15px_2px_#00ffff] overflow-hidden bg-black",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      {/* Container pour l'image avec ratio fixe */}
      <div className="relative w-full h-52 overflow-hidden">
        {/* Image header */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={typeof title === "string" ? title : "Card image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 to-black"></div>
        )}

        {/* Overlay gradient en diagonale */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/50 to-transparent z-10"></div>

        {/* Icon, si présent */}
        {icon && (
          <div className="absolute top-4 right-4 z-20 text-white">{icon}</div>
        )}
      </div>

      {/* Contenu textuel */}
      <div className="p-4 transition duration-200 relative z-10">
        <div className="font-sans font-bold text-2xl text-neutral-200 mb-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-400 text-lg">
          {description}
        </div>
      </div>
    </div>
  );
};
