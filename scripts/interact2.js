const { ethers } = require("hardhat");

async function main() {
    // Obter Signers da rede
    const [owner, user1, user2] = await ethers.getSigners();
    console.log("Signers disponíveis:");
    console.log("Owner:", owner.address);
    console.log("User1:", user1.address);
    console.log("User2:", user2.address);

    // Verificar saldo dos Signers para garantir que podem enviar transações
    for (const user of [owner, user1, user2]) {
        const balance = await ethers.provider.getBalance(user.address);
        console.log(`Saldo do ${user.address}: ${ethers.formatEther(balance)} ETH`);
    }

    // Conectar o contrato com o Owner (primeiro Signer)
    const contractAddress = "0xe135783649BfA7c9c4c6F8E528C7f56166efC8a6";
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    const contract = VotingSystem.attach(contractAddress);

    // Criar uma nova eleição
    const electionName = "Eleição Teste 2";
    let tx = await contract.connect(owner).createElection(electionName);
    await tx.wait();
    console.log(`Eleição criada: ${electionName}`);

    // Adicionar candidatos
    const candidates = ["Alice", "Bob", "Charlie"];
    for (const candidate of candidates) {
        tx = await contract.connect(owner).addCandidate(electionName, candidate);
        await tx.wait();
        console.log(`Candidato adicionado: ${candidate}`);
    }

    // Cenário de votação:
    // Votante 1 (User1) vota em Alice
    tx = await contract.connect(user1).vote(electionName, 0); // ID 0 -> Alice
    await tx.wait();
    console.log("User1 votou em Alice");

    // Votante 1 (User1) tenta votar novamente em Bob
    try {
        tx = await contract.connect(user1).vote(electionName, 1); // ID 1 -> Bob
        await tx.wait();
    } catch (error) {
        console.error("Erro esperado: User1 tentou votar novamente e foi impedido");
    }

    // Votante 2 (User2) vota em Bob
    tx = await contract.connect(user2).vote(electionName, 1); // ID 1 -> Bob
    await tx.wait();
    console.log("User2 votou em Bob");

    // Mostrar resultados após votos
    const results = await contract.getResults(electionName);
    console.log("Resultados da eleição:");
    console.log(results);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Erro na execução do script:", error);
        process.exit(1);
    });
