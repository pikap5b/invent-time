import React from 'react';
import { X, Download } from 'lucide-react';
import { Invoice } from '../../types';
import { useCompanySettings } from '../../hooks/useCompanySettings';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface InvoicePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ 
  isOpen, 
  onClose, 
  invoice 
}) => {
  const { settings } = useCompanySettings();

  const handleDownloadPDF = async () => {
    if (!invoice) return;

    const element = document.getElementById('invoice-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${invoice.number}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Invoice Preview - {invoice.number}
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div id="invoice-preview" className="bg-white p-8 max-w-4xl mx-auto">
            {/* Green Header Bar - Smaller */}
            <div className="w-full h-4 bg-green-600 mb-8"></div>

            {/* Header Section */}
            <div className="mb-12">
              {/* Company Info Block with Gray Background - All in One Line */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  {/* Logo */}
                  <div className="flex-shrink-0 mr-8">
                    {settings.logo ? (
                      <img 
                        src={settings.logo} 
                        alt="Company Logo" 
                        className="h-32 w-auto"
                      />
                    ) : (
                      <div className="flex items-center">
                        <div className="text-4xl font-bold text-black mr-2">X</div>
                        <div className="text-3xl font-bold text-green-500">TIME</div>
                        <div className="ml-2">
                          <div className="text-2xl font-bold text-green-500">EVENTS</div>
                          <div className="text-sm text-gray-600 uppercase tracking-wide">SOUND LIGHTS VISION</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Company Details */}
                  <div className="flex-1 mx-8">
                    <div className="text-xl font-bold text-black mb-2">{settings.name}</div>
                    <div className="font-medium text-gray-700 mb-1">VAT # {settings.vatNumber}</div>
                    {settings.address.split('\n').map((line, index) => (
                      <div key={index} className="text-gray-700">{line}</div>
                    ))}
                    <div className="text-gray-700 mt-1">{settings.email}</div>
                    <div className="text-gray-700">{settings.phone}</div>
                    {settings.website && (
                      <div className="text-blue-600 underline mt-1">{settings.website}</div>
                    )}
                  </div>

                  {/* Invoice Details */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-black mb-2">INVOICE</div>
                    <div className="text-xl font-bold text-black mb-4">{invoice.number}</div>
                    <div className="mb-3">
                      <div className="font-medium text-gray-600">DATE</div>
                      <div className="text-black">{format(invoice.date, 'dd MMM yyyy')}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">BALANCE DUE</div>
                      <div className="text-xl font-bold text-black">EUR €{invoice.total.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="mb-8">
              <div className="text-sm font-medium text-gray-600 mb-2">BILL TO</div>
              <div className="text-xl font-bold text-black mb-2">{invoice.client.name}</div>
              {invoice.client.vatNumber && (
                <div className="text-gray-700 mb-1">VAT {invoice.client.vatNumber}</div>
              )}
              <div className="text-gray-700">{invoice.client.address}</div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              {/* Table Header */}
              <div className="bg-green-600 text-white">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 font-medium">
                  <div className="col-span-6">DESCRIPTION</div>
                  <div className="col-span-2 text-center">RATE</div>
                  <div className="col-span-2 text-center">QTY</div>
                  <div className="col-span-2 text-right">AMOUNT</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="border-l border-r border-b border-gray-300">
                {invoice.items.map((item, index) => (
                  <div key={index} className={`grid grid-cols-12 gap-4 px-4 py-4 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                    <div className="col-span-6">
                      <div className="font-medium text-black">{item.description.split('\n')[0]}</div>
                      {item.description.split('\n').slice(1).map((line, i) => (
                        <div key={i} className="text-gray-600 text-sm">{line}</div>
                      ))}
                    </div>
                    <div className="col-span-2 text-center">€{item.price.toFixed(2)}</div>
                    <div className="col-span-2 text-center">{item.quantity}</div>
                    <div className="col-span-2 text-right font-medium">€{item.total.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-3 border-t-2 border-black">
                  <span className="text-xl font-bold text-black">TOTAL</span>
                  <span className="text-xl font-bold text-black">€{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">BANK DETAILS</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <div className="font-medium">Bank Name:</div>
                  <div>{settings.bankDetails.bankName}</div>
                </div>
                <div>
                  <div className="font-medium">Account Number:</div>
                  <div>{settings.bankDetails.accountNumber}</div>
                </div>
                <div>
                  <div className="font-medium">IBAN:</div>
                  <div>{settings.bankDetails.iban}</div>
                </div>
                <div>
                  <div className="font-medium">SWIFT:</div>
                  <div>{settings.bankDetails.swift}</div>
                </div>
              </div>
            </div>

            {/* Closing Message */}
            {settings.closingMessage && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-gray-700 italic">{settings.closingMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};