async function main() {
    const contractAddress = "0xe135783649BfA7c9c4c6F8E528C7f56166efC8a6"; // Endereço do contrato implantado
    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    const contract = VotingSystem.attach(contractAddress);

    // Criar uma nova eleição
    const electionName = "Eleição Presidencial 2026";
    let tx = await contract.createElection(electionName);
    await tx.wait();
    console.log(`Eleição criada: ${electionName}`);

    // Adicionar candidatos
    const candidates = ["Alice", "Bob", "Charlie"];
    for (const candidate of candidates) {
        tx = await contract.addCandidate(electionName, candidate);
        await tx.wait();
        console.log(`Candidato adicionado: ${candidate}`);
    }

    // Votação
    tx = await contract.vote(electionName, 1); // Votando em Bob (ID 1)
    await tx.wait();
    console.log("Voto registrado para Bob");

    // Exibir resultados
    const results = await contract.getResults(electionName);
    console.log(results);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
