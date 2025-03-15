export enum VoteStatus {
  RegisteringVoters,
  ProposalsRegistrationStarted,
  ProposalsRegistrationEnded,
  VotingSessionStarted,
  VotingSessionEnded,
  VotesTallied,
}

export const statusFunctionMap: Record<number, string> = {
  1: "startProposalsRegistering",
  2: "endProposalsRegistering",
  3: "startVotingSession",
  4: "endVotingSession",
  5: "tallyVotes",
};

export const getVoteStatusName = (statusIndex: number): string => {
  return VoteStatus[statusIndex] as string;
};

export default VoteStatus;
