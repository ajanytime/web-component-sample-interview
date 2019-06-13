let rates;
fetch('http://data.fixer.io/api/latest?access_key=a1eecf138d3a3769fafe851c71d57dea&symbols=USD,CAD,EUR&base=EUR')
    .then((response) => {
        if (response.ok)
            return response.json();
        throw new Error('Error fetching rates from fixer.io .....');
    })
    .then((data) => {
        rates = data.rates;
});

const template = document.createElement('template');

template.innerHTML = `
<style>
.container {
    max-width: 350px;
    width: 350px;
    padding: 20px;
    border: 1px solid grey;
}

h1 {
    margin: 4% 5% 5% ;
    font-size: 16px;
    font-weight: 500;
}
p {
    margin: -3% 5% 2%;
}

label {
    font-weight: 300;
    font-size: 12px;
}

input[type=number] {
    width: 50%;
    display: inline-block;
    padding: 2% 2%;
}

select {
    width: 35%;
    margin: 5% 5% 10%;
    height: 25px;
}

#disclaimer {
    float: right;
    font-size: 12px;
}
</style>
<div class="container">
    <h1>Currency Converter</h1>
    <p>
        <label>Type in the amount and select currency:</label><br>
        <input type="number" placeholder="0.00" name="src-amount"> 
        <select name="src-currency">
            <option value="CAD" selected>CAD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
        </select>
    </p>
    <p>
        <label>Converted amount:</label><br>
        <input type="number" disabled="true" placeholder="0.00" name="dest-amount"> 
        <select name="dest-currency">
            <option value="CAD">CAD</option>
            <option value="USD" selected>USD</option>
            <option value="EUR">EUR</option>
        </select>
    </p>
    <p id="disclaimer">
        <a target="_blank" href="http://google.com">Disclaimer</a>
    </p>
</div>
`;

export class CurrencyConverter extends HTMLElement {

    connectedCallback() {

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        let state = {};
        state.srcAmount = this.shadowRoot.querySelectorAll('input')[0];
        state.srcCurrency = this.shadowRoot.querySelectorAll('select')[0];
        state.destAmount = this.shadowRoot.querySelectorAll('input')[1];
        state.destCurrency = this.shadowRoot.querySelectorAll('select')[1];

        state.srcAmount.addEventListener('input', calculate);
        state.srcCurrency.addEventListener('change', calculate);
        state.destCurrency.addEventListener('change', calculate);

        function calculate() {
            let rawAmount = state.srcAmount.value *
                rates[state.destCurrency.value] / rates[state.srcCurrency.value];
            state.destAmount.value = Math.round(rawAmount * 100) / 100;
        }
    }
}

window.customElements.define('currency-converter', CurrencyConverter);