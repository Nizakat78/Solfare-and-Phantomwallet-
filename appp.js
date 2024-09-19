import { Connection, clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

const network = clusterApiUrl('mainnet-beta'); // Replace with your desired network
const connection = new Connection(network);

let wallet;

const connectWalletButton = document.getElementById("connect-wallet-button");
const amountInput = document.getElementById("amount-input");
const sendTransactionButton = document.getElementById("send-transaction-button");
const transactionInfoDiv = document.getElementById("transaction-info");

connectWalletButton.addEventListener("click", async () => {
  try {
    wallet = new WalletAdapterNetwork();
    window.adapter.setAdapter(wallet);
    await wallet.connect();
    console.log("Wallet connected:", wallet.publicKey);
    amountInput.disabled = false;
    sendTransactionButton.disabled = false;
  } catch (error) {
    console.error("Error connecting wallet:", error);
  }
});

sendTransactionButton.addEventListener("click", async () => {
  const amount = parseInt(amountInput.value);
  const recipientPublicKey = "F55YnYhNJadMfmi8Mbyqcr3fDHFU5i87ppPQPX29eVt9"; // Replace with the desired recipient public key

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (!wallet) {
    alert("Please connect your wallet before sending a transaction.");
    return;
  }

  try {
    const transaction = new web3.Transaction();
    transaction.add(
      web3.SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientPublicKey,
        lamports: amount,
      })
    );

    const signature = await web3.sendAndConfirmTransaction(connection, transaction, [wallet.publicKey]);
    console.log("Transaction successful:", signature);
    transactionInfoDiv.innerHTML = `Transaction sent successfully! Signature: ${signature}`;
  } catch (error) {
    console.error("Error sending transaction:", error);
    transactionInfoDiv.innerHTML = "Transaction failed.";
  }
});