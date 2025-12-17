type Invoice = {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  invoiceUrl?: string;
  receiptUrl?: string;
};

type BillingHistoryProps = {
  userId: string;
  invoices?: Invoice[];
};

export default function BillingHistory({ invoices = [] }: BillingHistoryProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100); // Convert cents to dollars
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const handleDownload = async (invoiceId: string, type: 'invoice' | 'receipt') => {
    try {
      const response = await fetch(`/api/stripe/download/${type}/${invoiceId}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
    }
  };

  return (
    <div className="bg-ps-secondary rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-ps-primary mb-6">
        Billing History
      </h2>

      {invoices.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-ps-neutral-200 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-ps-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ps-primary mb-2">
            No Billing History
          </h3>
          <p className="text-ps-text-secondary">
            Your billing history will appear here once you make your first payment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 border border-ps-border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-medium text-ps-text-primary">
                      {invoice.description}
                    </h3>
                    <p className="text-sm text-ps-text-secondary">
                      {formatDate(invoice.date)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}
                  >
                    {getStatusText(invoice.status)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-ps-text-primary">
                  {formatAmount(invoice.amount)}
                </span>

                <div className="flex items-center space-x-2">
                  {invoice.invoiceUrl && (
                    <button
                      onClick={() => handleDownload(invoice.id, 'invoice')}
                      className="p-2 text-ps-text-secondary hover:text-ps-text-primary transition-colors duration-200"
                      title="Download Invoice"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  )}

                  {invoice.receiptUrl && invoice.status === 'paid' && (
                    <button
                      onClick={() => handleDownload(invoice.id, 'receipt')}
                      className="p-2 text-ps-text-secondary hover:text-ps-text-primary transition-colors duration-200"
                      title="Download Receipt"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Load More Button (if needed) */}
          {invoices.length >= 10 && (
            <div className="text-center pt-4">
              <button className="px-4 py-2 text-sm font-medium text-ps-primary-600 hover:text-ps-primary-700 transition-colors duration-200">
                Load More
              </button>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      {invoices.length > 0 && (
        <div className="mt-6 p-4 bg-ps-neutral-50 rounded-lg">
          <p className="text-sm text-ps-text-secondary">
            <strong>Need help?</strong> If you have questions about a charge or need to dispute a payment, please contact our support team.
          </p>
        </div>
      )}
    </div>
  );
}