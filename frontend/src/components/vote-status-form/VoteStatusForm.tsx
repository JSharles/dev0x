import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import useWriteSC from "@/hooks/use-write-sc";
import VoteStatus from "@/types/vote-status";
import { getContractFunctionFromStatusIndex } from "@/types/sc-functions";

const VoteStatusForm = () => {
  const [selectedStatus, setSelectedStatus] = useState<{
    label: string;
    index: number;
  } | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContract, isSubmitting, error } = useWriteSC();

  const { data: currentWorkflowStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "workflowStatus",
  });

  const voteStatusOptions = Object.keys(VoteStatus)
    .filter((key) => isNaN(Number(key)))
    .map((key, index) => ({
      label: key,
      index,
    }));

  useEffect(() => {
    if (currentWorkflowStatus !== undefined && !selectedStatus) {
      const currentIndex = Number(currentWorkflowStatus);
      const currentOption = voteStatusOptions.find(
        (option) => option.index === currentIndex
      );
      if (currentOption) {
        setSelectedStatus(currentOption);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkflowStatus, voteStatusOptions]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash || undefined,
    });

  if (isConfirmed && txHash) {
    setTxHash(null);
  }

  const handleSubmit = async () => {
    if (!selectedStatus || isSubmitting || isConfirming) return;

    const contractFunction = getContractFunctionFromStatusIndex(
      selectedStatus.index
    );

    if (!contractFunction) {
      console.error("Invalid status selected");
      return;
    }

    try {
      const hash = await writeContract(contractFunction);
      setTxHash(hash);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <div className="space-y-4 py-2 bg-black text-white">
      <h2 className="text-lg font-semibold text-white">Vote Status</h2>

      <Select
        value={selectedStatus?.label}
        onValueChange={(value) => {
          const selected = voteStatusOptions.find(
            (option) => option.label === value
          );
          if (selected) setSelectedStatus(selected);
        }}
        disabled={isSubmitting || isConfirming}
      >
        <SelectTrigger className="w-full bg-gray-800 text-white border border-gray-600">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 text-white border border-gray-600">
          {voteStatusOptions.map(({ label }) => (
            <SelectItem
              key={label}
              value={label}
              className="hover:bg-gray-700 focus:bg-gray-700 text-white"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        className="w-full border-cyan-600 text-cyan-600 bg-transparent
             hover:bg-cyan-600/20 hover:border-cyan-400 hover:text-cyan-300
             transition-all disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!selectedStatus || isSubmitting || isConfirming}
      >
        {isSubmitting || isConfirming ? "Transaction en cours..." : "Submit"}
      </Button>

      {isConfirming && (
        <p className="text-sm text-cyan-400">
          Confirmation de la transaction... Veuillez patienter.
        </p>
      )}

      {error && <p className="text-sm text-red-400">Erreur: {error.message}</p>}
    </div>
  );
};

export default VoteStatusForm;
