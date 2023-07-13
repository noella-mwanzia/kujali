import { groupBy as __groupBy, round as __round } from 'lodash';

import * as puppeteer from 'puppeteer';
import * as admin from 'firebase-admin';

import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { _CreateInvoice } from './common/create-invoice.function';

export class sendInvoiceEmailHandler extends FunctionHandler<any, void> {
  private _tools: HandlerTools;

  private PUPPETEER_OPTIONS = {
    headless: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
      "--proxy-server='direct://'",
      '--proxy-bypass-list=*',
      '--deterministic-fetch',
    ],
  };

  public async execute(mailData: any, context: FunctionContext, tools: HandlerTools)
  {
    this._tools = tools;

    this._tools.Logger.debug(() => `Beginning Execution, Sending Email`);

    if (mailData.customerData.contact != '') {
      mailData = await this.addContactNameToInvoice(mailData);
    }

    await this.generateAndSavePdf(mailData);
  }

  private async generateAndSavePdf(mailData: any) {
    const browser = await puppeteer.launch(this.PUPPETEER_OPTIONS);
    const page = await browser.newPage();

    const invoiceSubTotals = this.generateInvoiceTotals(mailData.invoice.products);

    mailData.invoice.products = mailData.invoice.products.map((product, index) => ({
      ...product, position: index + 1}));

    const invoice = await _CreateInvoice(mailData, invoiceSubTotals);

    await page.emulateMediaType('screen');

    await page.evaluateHandle('document.fonts.ready');

    await page.setContent(invoice, {waitUntil: 'networkidle0'});

    const buffer = await page.pdf({
      format: 'A4',
      margin: { left: '30px', top: '30px', right: '30px', bottom: '20px' },
      printBackground: true
    });

    const fileName = `orgs/${mailData.orgId}/invoices/${mailData.invoiceNumber}.pdf`;

    const storageBucket = admin.storage().bucket();
    const storageRef = storageBucket.file(fileName);

    await storageRef.save(buffer).then(() => {
      this._tools.Logger.log(() => `Uploaded a file to ${fileName}`);
    });

    await storageBucket.makePublic({includeFiles: true, force: true});

    let downloadUrl = storageRef.publicUrl();

    let pdfUrl = {
      path: downloadUrl,
      filename: `${mailData.invoiceNumber}.pdf`,
    };

    await browser.close();

    await this.saveMail(mailData, pdfUrl);
  }

  private async addContactNameToInvoice(mailData: any): Promise<any> {
    let contactId = mailData.customerData.contact;

    let contactRepo = this._tools.getRepository<any>(
      `orgs/${mailData.orgId}/contacts`
    );

    let contact = await contactRepo.getDocumentById(contactId);

    mailData.customerData.contact = contact.fName + ' ' + contact.lName;

    return mailData;
  }

  private async saveMail(mailData: any, pdfUrl: any) {
    const invoiceMailsRepo = this._tools.getRepository<any>(
      `orgs/${mailData.orgId}/mails`
    );

    mailData.message.attachments.push(pdfUrl);

    delete mailData.invoice;
    delete mailData.companyData;
    delete mailData.customerData;

    await invoiceMailsRepo.create(mailData);

    this._tools.Logger.log(() => `Created the mail object`);
  }

  generateProductTotals(products: any) {
    let productTotals: any = products.map((product) => {
      const total =
        product.cost * product.qty -
        (product.cost * product.qty * product.discount) / 100;
      return {
        totalSum: total,
        vat: total * (product.vat / 100),
        vatPercent: product.vat,
      };
    });
    return productTotals;
  }

  generateInvoiceTotals(products: any) {
    let totals = this.generateProductTotals(products);

    let vats = __groupBy(totals, 'vatPercent');
    let uniqueVat = Object.values(vats);

    var totalResult = totals.reduce(function (invoice: any, value: any) {
      return invoice + value.totalSum;
    }, 0);

    var totalVatResult = totals.reduce(function (invoice: any, value: any) {
      return invoice + value.vat;
    }, 0);

    let result = {
      totalResult: __round(totalResult, 2),
      totalVatResult: __round(totalVatResult, 2),
      finalTotal: __round(totalResult + totalVatResult, 2),
      uniqueVat: uniqueVat,
    };

    return result;
  }
}
