async function connectWallet() {
    try {
        const starknet = window.starknet;
        const wallet = await starknet.enable();

        if (wallet) {
            console.log("Wallet object:", wallet); // Logs the entire wallet object

            const walletAddress = starknet.selectedAddress;
            console.log("Wallet Address:", walletAddress); // Logs the wallet address
            alert(`Wallet connected: ${walletAddress}`);

            // Save wallet address in session
            const formData = new FormData();
            formData.append("wallet_id", walletAddress);

            await fetch("/login", {
                method: "POST",
                body: formData
            });

            // Redirect or reload the page after connection
            window.location.reload();
        } else {
            alert("Connection failed. Please try again.");
        }
    } catch (error) {
        console.error("Error connecting wallet:", error); // Logs any error
        alert("An error occurred. Please check the console.");
    }
}

async function logout() {
    // Remove wallet_id from session and redirect to login page
    await fetch("/logout", { method: "POST" });
    window.location.href = "/login";
}
