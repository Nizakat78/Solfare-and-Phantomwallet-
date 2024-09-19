// Ensure Buffer is available globally
window.Buffer = window.Buffer || require('buffer').Buffer;

document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connect-wallet');
    const sendButton = document.getElementById('send-amount');
    const walletAddressDisplay = document.getElementById('wallet-address');
    const transactionStatus = document.getElementById('transaction-status');
    const amountInput = document.getElementById('amount');

    let userWalletAddress = null;

    // Connect to Solflare wallet
    connectButton.addEventListener('click', async () => {
        try {
            if (window.solflare && window.solflare.isSolflare) {
                await window.solflare.connect(); // Connect to Solflare
                userWalletAddress = window.solflare.publicKey.toString();
                walletAddressDisplay.textContent = `Wallet Address: ${userWalletAddress}`;
                sendButton.disabled = false; // Enable send button once connected
            } else {
                alert('Solflare wallet is not installed!');
            }
        } catch (error) {
            console.error('Failed to connect to Solflare wallet:', error);
            walletAddressDisplay.textContent = 'Failed to connect to Solflare wallet';
        }
    });

    // Send SOL Transaction
    sendButton.addEventListener('click', async () => {
        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        const recipientAddress = 'F55YnYhNJadMfmi8Mbyqcr3fDHFU5i87ppPQPX29eVt9'; // Your wallet address

        try {
            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: window.solflare.publicKey,
                    toPubkey: new solanaWeb3.PublicKey(recipientAddress),
                    lamports: amount * solanaWeb3.LAMPORTS_PER_SOL, // Convert SOL to lamports
                })
            );

            const { signature } = await window.solflare.signAndSendTransaction(transaction);
            await connection.confirmTransaction(signature);

            transactionStatus.textContent = `Transaction successful! Signature: ${signature}`;
        } catch (error) {
            console.error('Transaction failed:', error);
            transactionStatus.textContent = 'Transaction failed.';
        }
    });
});
