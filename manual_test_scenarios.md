### **Scenario 1: Connect to Different Wallets (Argent X, Bravos)**

**Steps:**

1.  Install Argent X and Bravos extensions in your browser.
2.  Open the application following the guide in the Read.me file.
3.  Click on the "Connect Wallet" button.
4.  Select "Argent X" from the wallet options.
5.  Confirm the connection in the Argent X wallet.
6.  Disconnect the wallet.
7.  Repeat steps 3–5 for the Bravos wallet.

**Expected Results:**

- The app connects successfully to both wallets.
- Wallet addresses are displayed after connection.

**Bugs:**

- There’s an error message (Error: Network Error) showing on the TVL and Users section of the app.

### **Scenario 2: Open Position with Different Wallets**

**Steps:**

1.  Ensure your wallet has some STRK tokens and ETH.
2.  Connect to the app using the Argent X wallet.
3.  Navigate to the "Launch App" section.
4.  Select "token" from the wallet options.
5.  Choose “multiplier.”
6.  Input the desired token amount.
7.  Click "Submit" and confirm the transaction in the wallet.
8.  Navigate to the “Position” section in the dashboard.
9.  Repeat steps 2–8 using the Bravos wallet.

**Expected Results:**

- The position is successfully created and appears in the dashboard for both wallets.
- A success or failure modal for the transaction is displayed.
- Transaction details appear in the dashboard.

**Bugs:**

1.  **Internal Server Error (500)**: Occurs when creating a position.
2.  Failure message text does not appear.
3.  Open positions do not show in the dashboard.

### **Scenario 3: Close Position with Different Wallets**

**Steps:**

1.  Connect to the app using the Argent X wallet.
2.  Navigate to the "Positions" section in the dashboard.
3.  Select an open position and click "Close Position."
4.  Confirm the transaction in the wallet.
5.  Repeat steps 1–4 using the Bravos wallet.

**Expected Results:**

- Positions are successfully closed for both wallets.
- Balances update correctly.

**Bugs:**

1.  Closed positions do not show in the dashboard.

### **Scenario 4: Open Position with Different Tokens**

**Steps:**

1.  Follow the steps in Scenario 1 to connect the wallet.
2.  Repeat the steps in Scenario 2 to create a position.
3.  For each attempt, select a different token:

    - First: Select ETH.
    - Second: Select STRK.
    - Third: Select DAI.
    - Fourth: Select USDC.

**Expected Results:**

- Positions are successfully created for all tokens and appear in the dashboard.
- A success or failure modal for each transaction is displayed.
- Transaction details are visible in the dashboard.

**Bugs:**

1.  **Internal Server Error (500)**: Occurs when creating a position.
2.  Failure message text does not appear.
3.  Open positions do not show in the dashboard.

### **Scenario 5: Validate Footer Links Functionality**

#### **Steps to Reproduce**

1.  **Connect Wallet**:

    - Use the Argent X wallet to connect to the application.

2.  **Navigate to Footer**:

    - Scroll down to the **Footer** section on the home page.

3.  **Click All Links**:

    - Individually click each link in the footer.

4.  **Verify Resources**:

    - Confirm that each link redirects to the intended resource or page.

#### **Expected Results**

- All links in the footer should:

  - Be functional (not broken).
  - Redirect to the correct resources as intended.

#### **Bugs Identified**

1.  **GitHub Link:**

    - Redirects to the general [github.com](https://github.com) instead of the Spotnet repository.

2.  **Overview Link:**

    - Does not navigate to the Overview resource as expected.

3.  **Terms and Conditions Link:**

    - Fails to point to the Terms and Conditions resource.

4.  **DeFi Link:**

    - Not linked to any resource (broken or inactive).

5.  **Twitter Link:**

    - Does not redirect to the associated Twitter profile.
