import { InvoiceGenerator } from '../model/invoice-template';

export async function _CreateInvoice (invoiceData: any, invoiceSubTotals: any) {

  const invoiceGenerator = new InvoiceGenerator(invoiceData, invoiceSubTotals);
  const invoiceHtmlContent = await invoiceGenerator.construct();

  return invoiceHtmlContent;
}