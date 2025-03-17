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
import { useAccount, useReadContract } from "wagmi";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  workflowStatusLabels,
} from "@/lib/constants";
import { toast } from "sonner";
import { useVoteStatusChange } from "@/hooks/use-vote-status-change";
import VoteForm from "../vote-form/VoteForm";
import ResultView from "../result-view/ResultView";

export const BentoGrid = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null);

  const { address } = useAccount();

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "owner",
  });

  const isOwner = address === owner;

  const { data: workflowStatus, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "workflowStatus",
    query: {
      gcTime: 0,
    },
  });

  const { newLog, clearNewLog } = useVoteStatusChange(() => {
    refetch();
  });

  useEffect(() => {
    if (newLog) {
      try {
        // @ts-expect-error Type error: Property 'args' does not exist on type 'Log'
        const args = newLog.args || {};
        const previousStatus = Number(args.previousStatus);
        const newStatus = Number(args.newStatus);

        toast.success("Statut de vote modifié", {
          description: `Changement de "${workflowStatusLabels[previousStatus]}" à "${workflowStatusLabels[newStatus]}"`,
          duration: 5000,
        });
      } catch (error) {
        console.log(error);
        toast.success("Statut de vote modifié", {
          description: "Le statut du vote a été mis à jour",
          duration: 3000,
        });
      }

      clearNewLog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newLog, clearNewLog, workflowStatusLabels]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const currentStatusLabel =
    workflowStatus !== undefined
      ? workflowStatusLabels[Number(workflowStatus)]
      : "Loading...";

  const items = [
    {
      title: "Status",
      description: `${currentStatusLabel}`,
      imageUrl: "/images/status-img.png",
      className: "md:col-span-3",
      form: <VoteStatusForm />,
      isAllowed: isOwner,
    },
    {
      title: "Register Voter",
      description: "Register new voters",
      imageUrl: "/images/register-voter-img.png",
      className: "md:col-span-2",
      form: <RegisterVoterForm />,
      isAllowed: isOwner,
    },
    {
      title: "Register Proposal",
      description: "Propose an idea to be voted on.",
      imageUrl: "/images/register-proposal-img.png",
      className: "md:col-span-1",
      form: <RegisterProposalForm />,
      isAllowed: true,
    },
    {
      title: "Vote",
      description: "Cast your vote on a proposal.",
      imageUrl: "/images/vote-img.png",
      className: "md:col-span-1",
      form: <VoteForm />,
      isAllowed: true,
    },
    {
      title: "Results",
      description: "See vote result and stats.",
      imageUrl: "/images/result-img.png",
      className: "md:col-span-2",
      form: <ResultView />,
      isAllowed: true,
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
                isAllowed={item.isAllowed}
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
          <div className="w-[90%] max-w-[600px] bg-black rounded-lg p-6 shadow-lg border border-gray-700 relative">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">
              {selectedItem?.title}
            </h2>
            {selectedItem?.form}

            {/* Conteneur centré */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="w-full  border-pink-500 text-pink-500 bg-transparent hover:bg-pink-500/20 hover:text-pink-300 transition-all"
                onClick={() => {
                  refetch();
                  setOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
