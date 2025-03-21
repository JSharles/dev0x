import { useEffect, useState } from "react";
import { BaseError, createPublicClient, http, parseAbiItem } from "viem";
import { hardhat } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

const VoteForm = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [proposals, setProposals] = useState<
    { id: number; description: string }[]
  >([]);
  const [loadingVote, setLoadingVote] = useState<number | null>(null);

  useEffect(() => {
    const fetchProposalLogs = async () => {
      try {
        const eventABI = parseAbiItem(
          "event ProposalRegistered(uint256 proposalId)"
        );

        const logs = await publicClient.getLogs({
          address: CONTRACT_ADDRESS,
          event: eventABI,
          fromBlock: "earliest",
          toBlock: "latest",
        });

        const ids = logs.map((log) => Number(BigInt(log.data)));

        if (ids.length > 0) {
          fetchProposalDetails(ids);
        }
      } catch (error: unknown) {
        if (error instanceof BaseError) {
          alert(error.shortMessage);
        } else {
          alert("An error occured");
        }
      }
    };

    fetchProposalLogs();
  }, []);

  const fetchProposalDetails = async (ids: number[]) => {
    try {
      const fetchedProposals = await Promise.all(
        ids.map(async (proposalId) => {
          const proposal = (await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: "getOneProposal",
            args: [proposalId],
          })) as Record<string, string>;

          return { id: proposalId, description: proposal.description };
        })
      );
      setProposals(fetchedProposals);
    } catch (error) {
      console.log(error);
    }
  };

  const voteForProposal = async (proposalId: number) => {
    if (!isConnected || !walletClient) return;

    setLoadingVote(proposalId);

    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "setVote",
        args: [proposalId],
        account: address,
      });

      await walletClient.writeContract(request);
    } catch (error: unknown) {
      let errorMessage = "Transaction failed.";

      if (error instanceof BaseError) {
        errorMessage = error.shortMessage;
      } else if (typeof error === "object" && error !== null) {
        const err = error as { message?: string; details?: string };
        if (err.message) errorMessage = err.message;
        else if (err.details) errorMessage = err.details;
      }

      alert(errorMessage);
    } finally {
      setLoadingVote(null);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 px-12">
      <h2 className="text-lg font-semibold text-white">Proposals</h2>
      {proposals.length > 0 ? (
        <Carousel className="w-full max-w-lg">
          <CarouselContent>
            {proposals.map((proposal) => (
              <CarouselItem key={proposal.id} className="p-4">
                <Card className="w-full bg-gray-900 text-white">
                  <CardHeader>
                    <CardTitle>Proposal {proposal.id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{proposal.description}</p>
                    <Button
                      onClick={() => voteForProposal(proposal.id)}
                      disabled={loadingVote === proposal.id}
                      className="mt-4 border w-full border-cyan-500 text-cyan-500 bg-cyan-500/20 hover:bg-cyan-500/40 hover:text-white transition-all"
                    >
                      {loadingVote === proposal.id ? "Voting..." : "Vote"}
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : null}
    </div>
  );
};

export default VoteForm;
