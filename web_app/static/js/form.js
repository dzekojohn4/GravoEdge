const balances = {
    {% for token, value in balances.items() %}
        "{{ token }}": {{ value }},
    {% endfor %}
};

function updateMaxBalance() {
    const selectedToken = document.getElementById('token').value;
    const maxBalance = balances[selectedToken] || 0;
    document.getElementById('amount').setAttribute('max', maxBalance);
}

function validateAmount() {
    const selectedToken = document.getElementById('token').value;
    const enteredAmount = parseFloat(document.getElementById('amount').value);
    const maxBalance = balances[selectedToken] || 0;

    if (enteredAmount > maxBalance) {
        document.getElementById('balance-warning').style.display = 'block';
        return false;
    } else {
        document.getElementById('balance-warning').style.display = 'none';
        return true;
    }
}
