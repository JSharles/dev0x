"use client";
import { cn } from "@/lib/utils";
import { BentoGridItem } from "./bento-grid-item";
import { Popover, PopoverTrigger } from "./popover";
import { useState, useEffect } from "react";
import { BentoItem } from "@/types/bento-items";
import VoteStatusForm from "../vote-status-form/VoteStatusForm";
import RegisterVoterForm from "../register-voter-form/RegisterVoterForm";
import RegisterProposalForm from "../register-proposal-form/register-proposal-form";
import { Button } from "./button";
import { useReadContract } from "wagmi";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  workflowStatusLabels,
} from "@/lib/constants";

export const BentoGrid = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { data: workflowStatus, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "workflowStatus",
    query: {
      gcTime: 0,
    },
  });

  const handleRefresh = () => {
    console.log("Forçage du rafraîchissement du status...");
    setRefreshCounter((prev) => prev + 1);
    refetch();
  };

  useEffect(() => {
    refetch();

    const interval = setInterval(() => {
      if (open) {
        console.log("Rafraîchissement périodique...");
        refetch();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshCounter, open, refetch]);

  const currentStatusLabel =
    workflowStatus !== undefined
      ? workflowStatusLabels[Number(workflowStatus)]
      : "Loading...";

  const items = [
    {
      title: "Status",
      description: `${currentStatusLabel}`,
      imageUrl: "/images/status-img.png",
      className: "md:col-span-1",
      form: <VoteStatusForm onStatusChange={handleRefresh} />,
    },
    {
      title: "Register Voter",
      description: "Register new voters",
      imageUrl: "/images/register-voter-img.png",
      className: "md:col-span-1",
      form: <RegisterVoterForm />,
    },
    {
      title: "Register Proposal",
      description: "Propose an idea to be voted on.",
      imageUrl: "/images/register-proposal-img.png",
      className: "md:col-span-1",
      form: <RegisterProposalForm />,
    },
    {
      title: "Vote",
      description: "Cast your vote on a proposal.",
      imageUrl: "/images/vote-img.png",
      className: "md:col-span-3",
      form: <>You can vote here</>,
    },
  ];

  return (
    <>
      <div
        className={cn(
          "grid md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-4",
          className
        )}
      >
        {items.map((item: BentoItem, i) => (
          <Popover key={i}>
            <PopoverTrigger asChild>
              <BentoGridItem
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                className={cn("cursor-pointer hover:scale-105", item.className)}
                onClick={() => {
                  setSelectedItem(item);
                  setOpen(true);
                  refetch();
                }}
              />
            </PopoverTrigger>
          </Popover>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="w-[90%] max-w-[400px] bg-black rounded-lg p-6 shadow-lg border border-gray-700 relative">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">
              {selectedItem?.title}
            </h2>
            {selectedItem?.form}

            <Button
              variant="outline"
              className="w-full mt-4 max-w-sm border-pink-500 text-pink-500 bg-transparent hover:bg-pink-500/20 hover:text-pink-300 transition-all"
              onClick={() => {
                handleRefresh();
                setOpen(false);
              }}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
