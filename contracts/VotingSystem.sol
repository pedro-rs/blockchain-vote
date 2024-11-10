// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract VotingSystem {

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Election {
        string electionName;
        bool isActive;
        mapping(uint256 => Candidate) candidates;
        mapping(address => bool) voters;
        uint256 candidateCount;
        uint256 totalVotes;
    }

    mapping(string => Election) private elections;

    event ElectionCreated(string electionName);
    event VoteCast(string electionName, string candidateName);

    modifier electionExists(string memory _electionName) {
        require(bytes(elections[_electionName].electionName).length > 0, "Election does not exist.");
        _;
    }

    modifier electionIsActive(string memory _electionName) {
        require(elections[_electionName].isActive, "Election is not active.");
        _;
    }

    function createElection(string memory _electionName) public {
        require(bytes(elections[_electionName].electionName).length == 0, "Election already exists.");
        elections[_electionName].electionName = _electionName;
        elections[_electionName].isActive = true;
        emit ElectionCreated(_electionName);
    }

    function addCandidate(string memory _electionName, string memory _candidateName) 
    public electionExists(_electionName) {
        Election storage election = elections[_electionName];
        election.candidates[election.candidateCount] = Candidate(_candidateName, 0);
        election.candidateCount++;
    }

    function vote(string memory _electionName, uint256 _candidateId) 
    public electionExists(_electionName) electionIsActive(_electionName) {
        Election storage election = elections[_electionName];
        require(!election.voters[msg.sender], "You have already voted.");

        require(_candidateId < election.candidateCount, "Invalid candidate ID.");

        election.candidates[_candidateId].voteCount++;
        election.totalVotes++;
        election.voters[msg.sender] = true;

        emit VoteCast(_electionName, election.candidates[_candidateId].name);
    }

    function getResults(string memory _electionName) 
    public view electionExists(_electionName) returns (string memory) {
        Election storage election = elections[_electionName];
        string memory results = "Results:\n";
        for (uint256 i = 0; i < election.candidateCount; i++) {
            results = string(abi.encodePacked(results, election.candidates[i].name, ": ", uint2str(election.candidates[i].voteCount), " votes\n"));
        }
        return results;
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
