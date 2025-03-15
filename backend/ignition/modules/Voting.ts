import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VotingModule = buildModule("VotingModule", (m) => {
  const votingContract = m.contract("Voting");

  return { votingContract };
});

export default VotingModule;
