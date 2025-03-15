import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/constants";
import {
  ContractFunctionType,
  isValidContractFunction,
} from "@/types/sc-functions";
import { useState, useCallback } from "react";
import { useWriteContract } from "wagmi";

export const useWriteSC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { writeContractAsync } = useWriteContract();

  const writeContract = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (functionName: ContractFunctionType, args: any[] = []) => {
      if (isSubmitting) return null;

      if (!isValidContractFunction(functionName)) {
        const error = new Error(`Invalid function: ${functionName}`);
        console.error(error);
        setError(error);
        return null;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const hash = await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName,
          args,
        });

        setTxHash(hash);
        return hash;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, writeContractAsync]
  );

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setTxHash(null);
    setError(null);
  }, []);

  return {
    writeContract,
    isSubmitting,
    txHash,
    error,
    reset,
  };
};

export default useWriteSC;
