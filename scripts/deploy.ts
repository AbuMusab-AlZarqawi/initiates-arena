import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "RITUAL");

  const Arena = await ethers.getContractFactory("InitiatesArena");
  const arena = await Arena.deploy();
  await arena.waitForDeployment();

  const address = await arena.getAddress();
  console.log("✅ InitiatesArena deployed to:", address);
  console.log("\nUpdate your frontend/.env.local:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
