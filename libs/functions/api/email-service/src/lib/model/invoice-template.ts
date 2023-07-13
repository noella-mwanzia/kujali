export class InvoiceGenerator {

  constructor(private invoiceData: any, private invoiceSubTotals: any) {}

  async construct() {
    return `
    <!DOCTYPE html>
    <html>
    <head>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

    <style>

    * {
    font-family: 'Poppins'!important;
  }

  .label-colored {
    font-family: 'Poppins';
    font-weight: 600;
    color: #263446!important;
    padding-bottom: 15px;
  }

  img {
    height: 80px;
    width: auto;
    object-fit: contain;
  }

  .label {
    font-family: 'Poppins';
    font-weight: 600;
    color: #263446!important;
  }

  .bank-account {
    margin: 0px 0px 5px 0px!important;
    font-size: 0.9rem!important;
  }

  .title-row, .totals {
    color: #263446!important;
    padding: 10px 0px;
  }

  .totals{
    border-top: solid #DFE5F0 3px!important;
    float: right;
  }

  .totals p {
    margin: 0px 0px 5px 0px!important;
  }

  .item-row {
    padding: 5px 0px;
    border-top: solid #DFE5F0 3px!important;
  }

  .sender p, .customer p, .dates p {
    margin: 0px;
  }

  .customer{
    background-color: #e4e5e8!important;
  }
    </style>

    </head>

    <body>

    <div style="margin: 20px;">
    <div id="invoice-pdf" class="invoice-pdf">

      <div style="display:flex; justify-content:space-between; width: 100%; margin-bottom: 10px;" >
        <img style="width: 100px; object-fit:contain; height: auto;" src=${this.invoiceData.companyData.logoUrl} alt="">
        <span class="title" style="color: #88949E!important; font-weight: 900; font-size: 40px; display: flex; align-items: center;">INVOICE</span>
      </div>

      <div class="companies" style="color: #88949E!important; display: flex; justify-content:space-between;  width: 100%; margin-bottom: 30px;">
        <div class="sender">
          <p> ${this.invoiceData.companyData.name} </p>
          <p> ${this.invoiceData.companyData.address} </p>
          <p> ${this.invoiceData.companyData.vatNo} </p>
          <p> ${this.invoiceData.companyData.email} </p>
        </div>

        <div class="invoice-details">
          <div class="dates" style="text-align: right;">
            <p> ${this.invoiceData.invoiceNumber} </p>
            <p> Date: ${this.invoiceData.invoice.date} </p>
            <p> Due Date: ${this.invoiceData.invoice.dueDate} </p>
          </div>
        </div>
      </div>

      <div style="color: #88949E!important">
        <p>Bank Accounts</p>
        ${(this.invoiceData.companyData.bankAccounts.map((account: string) =>
          `<p class="bank-account"> ${account} </p>`
        ).join(''))}
      </div>

      <div class="customer" style="display: flex; padding: 20px;
      justify-content: space-between; margin-bottom: 40px;">
        <div class="customer-details" style="color: #263446!important">
        <p class="label-colored">Bill To</p>
        <p> ${this.invoiceData.customerData.name.name} </p>
        <p> ${this.invoiceData.customerData.address} </p>
        <p> ${this.invoiceData.customerData.vat} </p>
        <p> ${this.invoiceData.customerData.email} </p>
      </div>
      </div>

      <div class="invoice-items">
        <div class="title-row" style="display:flex; justify-content: space-between;">
          <span class="label" style="width: 5%;">#</span>
          <span class="label" style="width: 40%;">Product/Service</span>
          <span class="label" style="width: 15%;">Cost</span>
          <span class="label" style="width: 15%;">Qty </span>
          <span class="label" style="width: 15%;">Tax(%)</span>
          <span class="label" style="width: 10%; text-align: end;">Total</span>
        </div>

        ${(this.invoiceData.invoice.products.map(
          (product: any) =>
         `
      <div class="item-row">
        <div style="display:flex; justify-content: space-between;">
          <span style="width:5%;">${product.position}</span>
          <span style="width:40%;">${product.desc}</span>
          <span style="width:15%;">${this.invoiceData.invoice.currency == 'EUR' ? `&euro;` : `&#36;`} ${product.cost}</span>
          <span style="width:15%;">${product.qty}</span>
          <span style="width:15%;">${product.vat}</span>
          <span style="width:10%; text-align: end;">${this.invoiceData.invoice.currency == 'EUR' ? `&euro;` : `&#36;`} ${this.getProductTotal(product)}</span>
          </div>
        </div>

        <div class="discount-row" style="margin-left: 10px; display:flex; justify-content: space-between; color: #88949E!important;">
          <span style="width:5%;"></span>
          <span style="width:40%;">${product.discount && product.discount[0] > 0 ? 'Discount' : ''}</span>
          <span style="width:15%;"></span>
          <span style="width:15%;"></span>
          <span style="width:15%;"></span>
          <span style="width:10%; text-align: end;">${product.discount && product.discount[0] > 0 ? `- ${this.invoiceData.invoice.currency == 'EUR' ? `&euro;` : `&#36;`} ${product.discount[0]}%` : ''}</span>
        </div>

      </div>
      `
      ).join(''))}
      <div class="totals" style="width:40%; margin-right: 20px; margin-top: 30px;">

        <div>
          <div class="total" style="margin-bottom: 5px; display: flex; justify-content: space-between;  text-align: end;">
            <p class="label">SubTotal</p>
            <p>${this.invoiceData.invoice.currency == 'EUR' ? `&euro;` : `&#36;`} ${this.invoiceSubTotals.totalResult} </p>
          </div>

          ${(this.invoiceSubTotals.uniqueVat.map((vat) => vat[0].vatPercent ?
            `
            <div class="total" style="margin-bottom: 5px; display: flex; justify-content: space-between;">
              <p class="label"> Tax(${vat[0].vatPercent}%) </p>
              <p>${this.invoiceData.invoice.currency == 'EUR' ? `&euro;` : `&#36;`} ${vat[0].totalSum}</p>
            </div>
            `
            : ``
          ).join(''))}

          <div class="total" style="margin-bottom: 5px; display: flex; justify-content: space-between;">
            <p class="label"> Total Tax </p>
            <p>${this.invoiceData.invoice.currency == 'EUR' ? `&euro;` : `&#36;`} ${this.invoiceSubTotals.totalVatResult}</p>
          </div>

          <div class="total" style="display: flex; justify-content: space-between; margin-top: 30px; font-size: 18px;">
            <p class="label">Total</p>
            <p class="label">${this.invoiceData.invoice.currency == 'EUR' ? `&euro;` : `&#36;`} ${this.invoiceSubTotals.finalTotal} </p>
          </div>

        </div>

      </div>
      </br>
      <div>
      </div>

    </div>
  </div>
  <div style="float: left; min-width: 100%!important;">
  <p>${this.invoiceData.invoice.structuredMessage}</p>
  <p>${this.invoiceData.extraNote}</p>
  </div>
    </body>
    </html>
    `
  }

  getProductTotal(product: any) {
    return (product.cost * product.qty) - (product.discount / 100);
  }
}
