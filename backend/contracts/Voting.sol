// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/**
 * @title Voting Contract
 * @author 
 * @notice Implements a secure voting system with proposal management, voter registration, voting process, and vote tallying.
 */
contract Voting is Ownable, ReentrancyGuard {
    uint public winningProposalID;
    uint public constant MAX_PROPOSALS = 100;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] public proposalsArray;
    mapping(address => Voter) private voters;
    mapping(bytes32 => bool) private proposalExists;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    /**
     * @notice Initializes the contract setting the deployer as the initial owner.
     */
    constructor() Ownable(msg.sender) {}

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // ::::::::::::: GETTERS ::::::::::::: //

    /**
     * @notice Get voter details for a given address
     * @param _addr Address of voter
     * @return Voter struct containing registration and voting status
     */
    function getVoter(address _addr) external view onlyVoters returns (Voter memory) {
        return voters[_addr];
    }

    /**
     * @notice Get proposal details by ID
     * @param _id Proposal ID
     * @return Proposal struct containing proposal description and vote count
     */
    function getOneProposal(uint _id) external view onlyVoters returns (Proposal memory) {
        require(_id < proposalsArray.length, "Proposal doesn't exist");
        return proposalsArray[_id];
    }

    /**
     * @notice Check if an address is registered as voter
     * @param _addr Address to check
     * @return bool True if registered, false otherwise
     */
    function isVoterRegistered(address _addr) external view returns (bool) {
        return voters[_addr].isRegistered;
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //

    /**
     * @notice Register a voter
     * @param _addr Address of voter to register
     */
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open');
        require(!voters[_addr].isRegistered, 'Already registered');

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //

    /**
     * @notice Add a new proposal
     * @param _desc Proposal description
     */
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed now');
        require(bytes(_desc).length > 0, 'Cannot submit empty proposal');
        require(proposalsArray.length < MAX_PROPOSALS, 'Max proposals limit reached');

        bytes32 proposalHash = keccak256(abi.encodePacked(_desc));
        require(!proposalExists[proposalHash], 'Proposal already exists');

        proposalsArray.push(Proposal({description: _desc, voteCount: 0}));
        proposalExists[proposalHash] = true;

        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /**
     * @notice Vote for a proposal
     * @param _id Proposal ID to vote for
     */
    function setVote(uint _id) external onlyVoters nonReentrant {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session is not active');
        require(!voters[msg.sender].hasVoted, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found');

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE MANAGEMENT ::::::::::::: //

    /**
     * @notice Start proposal registration session
     */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Cannot start proposal registration now');

        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        proposalsArray.push(Proposal({description: 'GENESIS', voteCount: 0}));

        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /**
     * @notice End proposal registration session
     */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposal registration is not active');

        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;

        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
     * @notice Start voting session
     */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Proposal registration not ended yet');

        workflowStatus = WorkflowStatus.VotingSessionStarted;

        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /**
     * @notice End voting session
     */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session is not active');

        workflowStatus = WorkflowStatus.VotingSessionEnded;

        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /**
     * @notice Tally the votes and determine the winning proposal
     */
    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, 'Voting session has not ended');

        uint winningProposalIdLocal;
        uint highestVoteCount = 0;

        for (uint p = 0; p < proposalsArray.length; p++) {
            if (proposalsArray[p].voteCount > highestVoteCount) {
                highestVoteCount = proposalsArray[p].voteCount;
                winningProposalID = p;
            }
        }

        workflowStatus = WorkflowStatus.VotesTallied;

        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}
