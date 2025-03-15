export enum ContractFunction {
  ADD_VOTER = "addVoter",
  START_PROPOSALS_REGISTERING = "startProposalsRegistering",
  END_PROPOSALS_REGISTERING = "endProposalsRegistering",
  START_VOTING_SESSION = "startVotingSession",
  END_VOTING_SESSION = "endVotingSession",
  TALLY_VOTES = "tallyVotes",
  ADD_PROPOSAL = "addProposal",
  SET_VOTE = "setVote",
  GET_VOTER = "getVoter",
  GET_ONE_PROPOSAL = "getOneProposal",
}

export type ContractFunctionType = `${ContractFunction}`;

export const isValidContractFunction = (
  functionName: string
): functionName is ContractFunctionType => {
  return Object.values(ContractFunction).includes(
    functionName as ContractFunction
  );
};

export const getContractFunctionFromStatusIndex = (
  statusIndex: number
): ContractFunction | null => {
  switch (statusIndex) {
    case 1:
      return ContractFunction.START_PROPOSALS_REGISTERING;
    case 2:
      return ContractFunction.END_PROPOSALS_REGISTERING;
    case 3:
      return ContractFunction.START_VOTING_SESSION;
    case 4:
      return ContractFunction.END_VOTING_SESSION;
    case 5:
      return ContractFunction.TALLY_VOTES;
    default:
      return null;
  }
};

export default ContractFunction;
