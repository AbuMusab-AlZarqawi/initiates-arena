# ⚔ Initiates Arena

A pre-mint community hype builder dApp for the **Initiates** NFT project on **Ritual Chain Testnet**.

Players register a Fighter Profile onchain, choose a Faction, battle other fighters, and compete for leaderboard glory — all before the NFTs have been minted.

---

## 🗂 Project Structure

```
initiates-arena/
├── contracts/
│   └── InitiatesArena.sol       ← Smart contract
├── scripts/
│   └── deploy.ts                ← Hardhat deploy script
├── hardhat.config.ts
├── package.json                 ← Hardhat dependencies
├── tsconfig.json
├── .env.example                 ← Root env (private key for deploy)
├── .gitignore
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx         ← Dynamic import (ssr:false) entry
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── AppClient.tsx    ← Main app shell
    │   │   ├── Providers.tsx    ← Wagmi + RainbowKit providers
    │   │   ├── Navbar.tsx       ← Logo + tabs + music toggle + wallet
    │   │   ├── ArenaHome.tsx    ← Hero / landing section
    │   │   ├── RegisterPanel.tsx
    │   │   ├── BattlePanel.tsx
    │   │   ├── LeaderboardPanel.tsx
    │   │   ├── FighterCard.tsx
    │   │   └── GeometricAvatar.tsx
    │   └── lib/
    │       ├── contract.ts      ← Chain def, address, ABI
    │       ├── factions.ts      ← Faction helpers, types
    │       └── asyncStorageMock.js
    ├── public/
    │   └── initiates/
    │       ├── symbol.jpg       ← ADD MANUALLY (logo ~18kb)
    │       └── soundtrack.mp3   ← ADD MANUALLY (music ~3mb)
    ├── next.config.js
    ├── tailwind.config.js
    ├── tsconfig.json            ← target: ES2020 (BigInt fix)
    ├── package.json
    └── .env.example
```

---

## 🚀 Step-by-Step Setup

### 1. Add your asset files

Before anything else, copy your two files into place:

```
frontend/public/initiates/symbol.jpg
frontend/public/initiates/soundtrack.mp3
```

---

### 2. Install contract dependencies

```powershell
# In the root initiates-arena/ folder
npm install
```

---

### 3. Set up root environment

```powershell
copy .env.example .env
```

Edit `.env` and add your MetaMask private key:

```
PRIVATE_KEY=0xyour_private_key_here
```

> ⚠️ Never commit `.env` to GitHub. It's in `.gitignore`.

---

### 4. Compile the smart contract

```powershell
npm run compile
```

You should see: `Compiled 1 Solidity file successfully`

---

### 5. Deploy to Ritual Chain Testnet

Make sure your MetaMask wallet has testnet RITUAL tokens.

```powershell
npm run deploy
```

Copy the deployed contract address from the output. It will look like:

```
✅ InitiatesArena deployed to: 0xAbCd...1234
```

---

### 6. Install frontend dependencies

```powershell
cd frontend
npm install
```

---

### 7. Set up frontend environment

```powershell
copy .env.example .env.local
```

Edit `frontend/.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YourWalletConnectProjectId
```

> Get a free WalletConnect Project ID at https://cloud.walletconnect.com

---

### 8. Run locally

```powershell
npm run dev
```

Visit http://localhost:3000

---

## 📦 Push to GitHub

```powershell
# From the root initiates-arena/ folder
git init
git add .
git commit -m "feat: Initiates Arena dApp"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/initiates-arena.git
git branch -M main
git push -u origin main
```

---

## 🌐 Deploy to Vercel

1. Go to https://vercel.com → **New Project**
2. Import your GitHub repo
3. **IMPORTANT — Set Root Directory to:** `frontend`
4. Framework: Next.js (auto-detected)
5. Add these **Environment Variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0xYourDeployedContractAddress` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `YourWalletConnectProjectId` |

6. Click **Deploy**

---

## ⚙️ The Three Vercel Fixes (Already Applied)

| Error | Fix Applied |
|-------|-------------|
| `BigInt literal` build error | `"target": "ES2020"` in `frontend/tsconfig.json` |
| `@react-native-async-storage/async-storage` module error | `NormalModuleReplacementPlugin` in `next.config.js` + `asyncStorageMock.js` |
| `window is not defined` SSR error | `dynamic(() => import(...), { ssr: false })` wrapping all browser components in `page.tsx` |

---

## 🎮 App Features

- **Register Fighter** — Pay 0.001 RITUAL, choose Ritty / Bitty / Ritualist (10% chance of Radiant Ritualist upgrade)
- **Traits** — Strength, Speed, Cunning (1–100) assigned by blockhash randomness
- **Battle** — Challenge any registered fighter; contract computes winner onchain
- **Leaderboard** — Live ranked table by wins, with faction colors and rank badges (Bronze / Silver / Gold / Obsidian)
- **Geometric Avatar** — Deterministic SVG pattern generated from wallet address
- **Background Music** — Autoplay looped soundtrack with mute/unmute toggle in navbar

## 🏰 The Four Factions

| Faction | Color | Vibe |
|---------|-------|------|
| 🔥 Ritty | Ember red | Scrappy underdog, street fighter |
| 🌿 Bitty | Forest green | Cunning, trickster, nature magic |
| ✦ Ritualist | Deep violet | Arcane, scholarly, mysterious |
| 👑 Radiant Ritualist | Gold | Legendary, divine, rare (~10% chance) |

## 🔗 Network

- **Chain:** Ritual Chain Testnet
- **Chain ID:** 1979
- **RPC:** https://rpc.ritualfoundation.org
- **Symbol:** RITUAL
- **Registration fee:** 0.001 RITUAL
