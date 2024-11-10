async function main() {
    const VotingSystem = await ethers.deployContract("VotingSystem");
    await VotingSystem.waitForDeployment();
    console.log("Contrato de votação implantado em:", VotingSystem.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });