const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0xe135783649BfA7c9c4c6F8E528C7f56166efC8a6";
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    const contract = VotingSystem.attach(contractAddress);

    // Função auxiliar para medir o tempo de execução de uma transação
    async function measureTransactionTime(fn, ...args) {
        const startTime = Date.now();
        const tx = await fn(...args);
        await tx.wait();
        const endTime = Date.now();
        return endTime - startTime;
    }

    // Criar 5 eleições e medir o tempo de criação
    let times = [];
    let electionNames = [];
    for (let i = 0; i < 5; i++) {
        const electionName = `Desempenho Eleição v1 ${i}`;
        electionNames.push(electionName);
        const time = await measureTransactionTime(contract.createElection.bind(contract), electionName);
        times.push(time);
        console.log(`Tempo de criação da eleição "${electionName}": ${time} ms`);
    }
    const avgCreateElectionTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`Tempo médio de criação de eleição: ${avgCreateElectionTime.toFixed(2)} ms`);

    // Adicionar candidatos a cada eleição e medir tempo
    times = [];
    for (const electionName of electionNames) {
        for (let i = 0; i < 5; i++) {
            const candidateName = `Candidato ${i}`;
            const time = await measureTransactionTime(contract.addCandidate.bind(contract), electionName, candidateName);
            times.push(time);
            console.log(`Tempo de adição de candidato ${candidateName} em "${electionName}": ${time} ms`);
        }
    }
    const avgAddCandidateTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`Tempo médio de adição de candidato: ${avgAddCandidateTime.toFixed(2)} ms`);

    // Medir tempo de votação em cada eleição
    times = [];
    for (const [index, electionName] of electionNames.entries()) {
        const time = await measureTransactionTime(contract.vote.bind(contract), electionName, index % 5); // ID do candidato
        times.push(time);
        console.log(`Tempo de votação na eleição "${electionName}": ${time} ms`);
    }
    const avgVoteTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`Tempo médio de votação: ${avgVoteTime.toFixed(2)} ms`);

    // Medir tempo de obtenção de resultados para cada eleição
    times = [];
    for (const electionName of electionNames) {
        const startTime = Date.now();
        await contract.getResults(electionName);
        const endTime = Date.now();
        const time = endTime - startTime;
        times.push(time);
        console.log(`Tempo de obtenção de resultados da eleição "${electionName}": ${time} ms`);
    }
    const avgGetResultsTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`Tempo médio de obtenção de resultados: ${avgGetResultsTime.toFixed(2)} ms`);

    console.log("\nResumo das métricas de desempenho:");
    console.log(`Tempo médio de criação de eleição: ${avgCreateElectionTime.toFixed(2)} ms`);
    console.log(`Tempo médio de adição de candidato: ${avgAddCandidateTime.toFixed(2)} ms`);
    console.log(`Tempo médio de votação: ${avgVoteTime.toFixed(2)} ms`);
    console.log(`Tempo médio de obtenção de resultados: ${avgGetResultsTime.toFixed(2)} ms`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Erro na execução do script:", error);
        process.exit(1);
    });
