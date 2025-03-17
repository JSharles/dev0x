"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWaitForTransactionReceipt } from "wagmi";
import useWriteSC from "@/hooks/use-write-sc";
import ContractFunction from "@/types/sc-functions";

const RegisterProposalForm = () => {
  const [proposal, setProposal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContract } = useWriteSC();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash || undefined,
    });

  if (isConfirmed && txHash) {
    setTxHash(null);
    setIsSubmitting(false);
    setProposal("");
  }

  const handleSubmit = async () => {
    if (!proposal || isSubmitting || isConfirming) return;

    setIsSubmitting(true);

    try {
      const hash = await writeContract(ContractFunction.ADD_PROPOSAL, [
        proposal,
      ]);
      setTxHash(hash);
    } catch (error) {
      console.error("Transaction failed", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 py-2 bg-black text-white">
      <h2 className="text-lg font-semibold text-white">Register Proposal</h2>

      <Input
        placeholder="Enter proposal..."
        value={proposal}
        onChange={(e) => setProposal(e.target.value)}
        className="w-full bg-gray-800 text-white border border-gray-600"
        disabled={isSubmitting || isConfirming}
      />

      <Button
        variant="outline"
        className="w-full border-cyan-600 text-cyan-600 bg-transparent
             hover:bg-cyan-600/20 hover:border-cyan-400 hover:text-cyan-300
             transition-all disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!proposal || isSubmitting || isConfirming}
      >
        {isSubmitting || isConfirming
          ? "Transaction en cours..."
          : "Register Proposal"}
      </Button>

      {isConfirming && (
        <p className="text-sm text-cyan-400">
          Confirmation de la transaction... Veuillez patienter.
        </p>
      )}
    </div>
  );
};

export default RegisterProposalForm;
