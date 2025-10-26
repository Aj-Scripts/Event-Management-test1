const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateETicket = async (booking, event, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Colors
      const primaryColor = '#007bff'; // Blue
      const secondaryColor = '#f8f9fa'; // Light gray
      const textColor = '#333333'; // Dark gray

      // Header Section
      doc.rect(0, 0, doc.page.width, 80).fill(primaryColor);
      doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('E-Ticket', 0, 30, { align: 'center' });
      doc.moveDown(2);

      // Event Details Section
      doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text('Event Details', { underline: true });
      doc.moveDown(0.5);
      doc.fillColor(textColor).font('Helvetica').fontSize(12);
      doc.rect(50, doc.y, doc.page.width - 100, 80).fill(secondaryColor).stroke(primaryColor);
      doc.fillColor(textColor);
      doc.text(`Event: ${event.title}`, 60, doc.y + 10);
      doc.text(`Venue: ${event.venue}`, 60, doc.y + 25);
      doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`, 60, doc.y + 40);
      doc.text(`Time: ${event.time}`, 60, doc.y + 55);
      doc.moveDown(3);

      // Booking Details Section
      doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text('Booking Details', { underline: true });
      doc.moveDown(0.5);
      doc.fillColor(textColor).font('Helvetica').fontSize(12);
      doc.rect(50, doc.y, doc.page.width - 100, 60).fill(secondaryColor).stroke(primaryColor);
      doc.fillColor(textColor);
      doc.text(`Tickets: ${booking.tickets}`, 60, doc.y + 10);
      doc.text(`Total Amount: $${booking.totalAmount}`, 60, doc.y + 25);
      doc.text(`Booking ID: ${booking._id}`, 60, doc.y + 40);
      doc.text(`Status: ${booking.status}`, 300, doc.y + 40);
      doc.moveDown(3);

      // User Details Section
      doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text('User Details', { underline: true });
      doc.moveDown(0.5);
      doc.fillColor(textColor).font('Helvetica').fontSize(12);
      doc.rect(50, doc.y, doc.page.width - 100, 40).fill(secondaryColor).stroke(primaryColor);
      doc.fillColor(textColor);
      doc.text(`Booked by: ${user.name}`, 60, doc.y + 10);
      doc.text(`Email: ${user.email}`, 60, doc.y + 25);
      doc.moveDown(2);

      // QR Code Section
      doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text('Verification', { align: 'center', underline: true });
      doc.moveDown(0.5);
      doc.fillColor(textColor).font('Helvetica').fontSize(12).text('Scan the QR Code below for verification:', { align: 'center' });
      doc.moveDown();

      // Generate QR Code
      const qrData = `Booking ID: ${booking._id}\nEvent: ${event.title}\nUser: ${user.email}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrData, { width: 150, margin: 1 });

      // Convert data URL to buffer
      const qrBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');

      // Add QR Code to PDF
      doc.image(qrBuffer, { fit: [150, 150], align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateETicket };
