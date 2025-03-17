import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

const ResultView = () => {
  const [winningProposal, setWinningProposal] = useState<{
    id: number;
    description: string;
    voteCount: number;
  } | null>(null);

  useEffect(() => {
    const fetchWinningProposal = async () => {
      try {
        const winningProposalID: unknown = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "winningProposalID",
        });

        if (Number(winningProposalID) >= 0) {
          const proposal: Record<string, string> =
            (await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CONTRACT_ABI,
              functionName: "getOneProposal",
              args: [Number(winningProposalID)],
            })) as Record<string, string>;

          setWinningProposal({
            id: Number(winningProposalID),
            description: proposal.description,
            voteCount: Number(proposal.voteCount),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchWinningProposal();
  }, []);

  return (
    <div className="space-y-4 py-2 bg-black text-white">
      <h2 className="text-lg font-semibold text-white">Results</h2>
      {winningProposal ? (
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
          <h3 className="text-lg font-bold">Winning Proposal</h3>
          <p className="mt-2">
            <strong>ID:</strong> {winningProposal.id}
          </p>
          <p className="mt-1">
            <strong>Description:</strong> {winningProposal.description}
          </p>
          <p className="mt-1">
            <strong>Votes:</strong> {winningProposal.voteCount}
          </p>
        </div>
      ) : (
        <p className="text-gray-400">No results available yet.</p>
      )}
    </div>
  );
};

export default ResultView;
