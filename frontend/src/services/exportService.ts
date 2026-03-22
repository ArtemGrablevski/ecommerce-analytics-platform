// @ts-ignore
import jsPDF from 'jspdf';

export interface DashboardData {
  [key: string]: any;
}

export class ExportService {
  static async exportToPDF(dashboardData: DashboardData) {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      pdf.setFillColor(99, 102, 241);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analytics dashboard report', margin, 25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, margin, 35);
            
      let yPosition = 70;
      
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Executive summary', margin, yPosition);
      yPosition += 15;

      const keyMetrics = [
        { 
          label: 'Daily active users', 
          value: this.formatNumber(dashboardData.daily_active_users?.value),
          icon: '👥'
        },
        { 
          label: 'Daily revenue', 
          value: this.formatCurrency(dashboardData.daily_revenue?.value),
          icon: '💰'
        },
        { 
          label: 'New registrations', 
          value: this.formatNumber(dashboardData.new_registrations_today?.value),
          icon: '✨'
        },
        { 
          label: 'Conversion rate', 
          value: this.formatPercentage(dashboardData.conversion_rate_cart_to_purchase?.value),
          icon: '📈'
        }
      ];
      
      const cardWidth = (contentWidth - 15) / 2;
      const cardHeight = 30;
      
      keyMetrics.forEach((metric, index) => {
        const x = margin + (index % 2) * (cardWidth + 15);
        const y = yPosition + Math.floor(index / 2) * (cardHeight + 10);
        
        // Card background
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F');
        
        pdf.setDrawColor(226, 232, 240);
        pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'S');
        
        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(metric.label, x + 8, y + 12);
        
        pdf.setTextColor(15, 23, 42);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(metric.value, x + 8, y + 22);
      });
      
      yPosition += 80;
      
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 30;
      }
      
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Performance metrics', margin, yPosition);
      yPosition += 20;
      
      const performanceData = [
        ['Metric', 'Current value'],
        ['Weekly active users', this.formatNumber(dashboardData.weekly_active_users?.value)],
        ['Monthly active users', this.formatNumber(dashboardData.monthly_active_users?.value)],
        ['Cart abandonment rate', this.formatPercentage(dashboardData.cart_abandonment_rate?.value)],
        ['Average order value', this.formatCurrency(dashboardData.average_order_value?.value)],
        ['ARPU (7 days)', this.formatCurrency(dashboardData.arpu_7_days?.value)],
        ['User engagement score', this.formatNumber(dashboardData.user_engagement_score?.value)],
        ['Total page views', this.formatNumber(dashboardData.total_page_views?.value)],
      ];
      
      this.drawTable(pdf, performanceData, margin, yPosition, contentWidth);
      yPosition += (performanceData.length * 8) + 20;
      
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 30;
      }
      
      // Top Performers Section
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Top performers', margin, yPosition);
      yPosition += 20;
      
      // Top Pages
      const topPages = dashboardData.top_pages_by_views?.rows || [];
      if (topPages.length > 0) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(99, 102, 241);
        pdf.text('Top pages by views', margin, yPosition);
        yPosition += 12;
        
        const pageTableData = [
          ['#', 'Page', 'Views'],
          ...topPages.slice(0, 5).map((page: any, index: number) => [
            (index + 1).toString(),
            page.page.length > 40 ? page.page.substring(0, 37) + '...' : page.page,
            this.formatNumber(page.views)
          ])
        ];
        
        this.drawTable(pdf, pageTableData, margin, yPosition, contentWidth);
        yPosition += (pageTableData.length * 8) + 20;
      }
      
      const topElements = dashboardData.most_clicked_elements?.rows || [];
      if (topElements.length > 0) {
        if (yPosition > pageHeight - 80) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(34, 197, 94);
        pdf.text('Most clicked elements', margin, yPosition);
        yPosition += 12;
        
        const elementTableData = [
          ['#', 'Element', 'Clicks'],
          ...topElements.slice(0, 5).map((element: any, index: number) => [
            (index + 1).toString(),
            element.element_name.length > 40 ? element.element_name.substring(0, 37) + '...' : element.element_name,
            this.formatNumber(element.clicks)
          ])
        ];
        
        this.drawTable(pdf, elementTableData, margin, yPosition, contentWidth);
        yPosition += (elementTableData.length * 8) + 20;
      }
      
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Generated by Analytics Platform', margin, pageHeight - 15);
      pdf.text(`© ${new Date().getFullYear()} Analytics Dashboard`, pageWidth - margin - 40, pageHeight - 15);
      
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text('Page 1', pageWidth - margin - 15, pageHeight - 8);
      
      const fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      return { success: true, fileName };
    } catch (error) {
      console.error('PDF generation failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
  
  private static drawTable(pdf: jsPDF, data: string[][], x: number, y: number, width: number) {
    const rowHeight = 8;
    const colWidths = this.calculateColumnWidths(data, width);
    
    data.forEach((row, rowIndex) => {
      let currentX = x;
      
      row.forEach((cell, colIndex) => {
        const cellY = y + (rowIndex * rowHeight);
        
        // Header row styling
        if (rowIndex === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.rect(currentX, cellY - 5, colWidths[colIndex], rowHeight, 'F');
          pdf.setTextColor(71, 85, 105);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
        } else {
          // Data row styling
          if (rowIndex % 2 === 0) {
            pdf.setFillColor(255, 255, 255);
          } else {
            pdf.setFillColor(249, 250, 251);
          }
          pdf.rect(currentX, cellY - 5, colWidths[colIndex], rowHeight, 'F');
          pdf.setTextColor(51, 65, 85);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
        }
        
        // Cell border
        pdf.setDrawColor(226, 232, 240);
        pdf.rect(currentX, cellY - 5, colWidths[colIndex], rowHeight, 'S');
        
        // Cell text
        pdf.text(cell, currentX + 3, cellY);
        currentX += colWidths[colIndex];
      });
    });
  }
  
  private static calculateColumnWidths(data: string[][], totalWidth: number): number[] {
    const numCols = data[0].length;
    const baseWidth = totalWidth / numCols;
    return Array(numCols).fill(baseWidth);
  }
  
  private static formatNumber(value: number | string | undefined): string {
    if (value === undefined || value === null) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'N/A';
    return numValue.toLocaleString();
  }
  
  private static formatCurrency(value: number | string | undefined): string {
    if (value === undefined || value === null) return '$0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '$0.00';
    return `$${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  private static formatPercentage(value: number | string | undefined): string {
    if (value === undefined || value === null) return '0%';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0%';
    return `${numValue.toFixed(1)}%`;
  }
}