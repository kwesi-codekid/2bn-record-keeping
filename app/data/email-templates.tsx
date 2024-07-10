export function generateApprovalEmail({
  staffName,
  approvalDate,
  approvedBy,
}: {
  staffName: string;
  approvalDate: string;
  approvedBy: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Medical Request Approval</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url(https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic);
        @import url(https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic);
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://res.cloudinary.com/depow7mhg/image/upload/v1718463282/logo-black-text_idmjbv.png" alt="Company Logo" class="logo">
            <div class="header">
                <h1>Medical Request Approved</h1>
            </div>
            <div class="content">
                <p>Dear ${staffName},</p>
                <p>We are pleased to inform you that your medical request, submitted on ${approvalDate}, has been approved. Please find the details of the approval below:</p>
                <p><strong>Approval Date:</strong> ${approvalDate}</p>
                <p><strong>Approved By:</strong> ${approvedBy}</p>
                <p>You can now proceed to the clinic for treatment.</p>
                <p>Contact Adamus IT for further assistance.</p>
                <p>Thank you for your attention.</p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

export function generateReviewNotificationEmail({
  managerName,
  staffName,
  requestDate,
}: {
  managerName: string;
  staffName: string;
  requestDate: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Medical Request for Review</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url(https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic);
        @import url(https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic);
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://res.cloudinary.com/depow7mhg/image/upload/v1718463282/logo-black-text_idmjbv.png" alt="Company Logo" class="logo">
            <div class="header">
                <h1>New Medical Request for Review</h1>
            </div>
            <div class="content">
                <p>Dear ${managerName},</p>
                <p>We would like to inform you that a new medical request has been submitted by ${staffName} on ${requestDate} for your review. Please find the details below:</p>
                <p><strong>Staff Name:</strong> ${staffName}</p>
                <p><strong>Request Date:</strong> ${requestDate}</p>
                <p>Please review the request at your earliest convenience.</p>
                <p>Contact Adamus IT for further assistance.</p>
                <p>Thank you for your attention.</p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export function generateMedicalOfficerAprrovedRequestNotification({
  staffName,
  approvalDate,
  approvedBy,
}: {
  staffName: string;
  approvalDate: string;
  approvedBy: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Medical Request Approval</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
        @import url('https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
        </style>
    </head>
    <body>
        <div class="container">
                        <img src="https://res.cloudinary.com/depow7mhg/image/upload/v1718463282/logo-black-text_idmjbv.png" alt="Company Logo" class="logo">

            <div class="header">
                <h1>Medical Request Approved</h1>
            </div>
            <div class="content">
                <p>Dear Medical Officers,</p>
                <p>We are pleased to inform you that the medical request submitted by ${staffName} on ${approvalDate} has been approved. Please find the details of the approval below:</p>
                <p><strong>Approval Date:</strong> ${approvalDate}</p>
                <p><strong>Approved By:</strong> ${approvedBy}</p>
                <p>${staffName} will be visiting the clinic soon for treatment. Please make the necessary preparations.</p>
                <p>Contact Adamus IT for further assistance.</p>
                <p>Thank you for your attention.</p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export function generateLabRequestNotification({
  staffName,
  labsRequested,
  requestingMedicalOfficer,
}: {
  staffName: string;
  labsRequested: string[];
  requestingMedicalOfficer: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lab Request Notification</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
        @import url('https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
            .labs-list {
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
                        <img src="https://res.cloudinary.com/depow7mhg/image/upload/v1718463282/logo-black-text_idmjbv.png" alt="Company Logo" class="logo">

            <div class="header">
                <h1>Lab Request Notification</h1>
            </div>
            <div class="content">
                <p>Dear Lab Technician,</p>
                <p>We are pleased to inform you that a lab request has been submitted for ${staffName}. Please find the details of the request below:</p>
                <p><strong>Staff:</strong> ${staffName}</p>
                <p><strong>Requesting Medical Officer:</strong> ${requestingMedicalOfficer}</p>
                <p><strong>Labs Requested:</strong></p>
                <ul class="labs-list">
                    ${labsRequested}
                </ul>
                <p>Please make the necessary preparations for these lab tests.</p>
                <p>Contact Adamus IT for further assistance.</p>
                <p>Thank you for your attention.</p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export function generateLabResultsNotification({
  staffName,
  labRequestDate,
  resultsDate,
  labsRequested,
  requestingMedicalOfficer,
}: {
  staffName: string;
  labRequestDate: string;
  resultsDate: string;
  labsRequested: string[];
  requestingMedicalOfficer: string;
}): string {
  const labsList = labsRequested.map((lab) => `<li>${lab}</li>`).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lab Results Notification</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
        @import url('https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
            .labs-list {
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <div class="container">
                        <img src="https://res.cloudinary.com/depow7mhg/image/upload/v1718463282/logo-black-text_idmjbv.png" alt="Company Logo" class="logo">

            <div class="header">
                <h1>Lab Results Notification</h1>
            </div>
            <div class="content">
                <p>Dear Medical Officers,</p>
                <p>We are pleased to inform you that the lab results for ${staffName} are now available. The lab request was made on ${labRequestDate}, and the results were finalized on ${resultsDate}. Please find the details of the labs requested below:</p>
                <p><strong>Lab Request Date:</strong> ${labRequestDate}</p>
                <p><strong>Results Date:</strong> ${resultsDate}</p>
                <p><strong>Requesting Medical Officer:</strong> ${requestingMedicalOfficer}</p>
                <p><strong>Labs Requested:</strong></p>
                <ul class="labs-list">
                    ${labsList}
                </ul>
                <p>Please review the results at your earliest convenience.</p>
                <p>Contact Adamus IT for further assistance.</p>
                <p>Thank you for your attention.</p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export function generateCompletedTreatmentNotification({
  staffName,
  treatmentCompletionDate,
  medicalOfficer,
  workStatus,
  excuseDutyDuration,
  reviewDate,
}: {
  staffName: string;
  treatmentCompletionDate: string;
  medicalOfficer: string;
  workStatus: string;
  excuseDutyDuration?: string;
  reviewDate?: string;
}): string {
  const nextAppointment = reviewDate
    ? `<p>Please be informed that you are scheduled for a follow-up appointment on ${reviewDate}. Kindly ensure to attend the clinic on the specified date.</p>`
    : `<p>Your visit is now complete. No further appointments are scheduled.</p>`;

  const excuseDutyText = excuseDutyDuration
    ? `After the consultation, you have been given <strong>${workStatus}</strong> for a duration of <strong>${excuseDutyDuration} days</strong>.`
    : `After the consultation, you have been given <strong>${workStatus}</strong>.`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Completed Medical Treatment Notification</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
        @import url('https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://asset.cloudinary.com/depow7mhg/0eb6e701cda8baba5c1fe665a7d0ee06" alt="Company Logo" class="logo">
            <div class="header">
                <h1>Completed Medical Treatment Notification</h1>
            </div>
            <div class="content">
                <p>Dear ${staffName},</p>
                <p>We are pleased to inform you that your medical treatment, which commenced on ${treatmentCompletionDate}, has been successfully completed. Please find the details of your treatment below:</p>
                <p><strong>Completion Date:</strong> ${treatmentCompletionDate}</p>
                <p><strong>Medical Officer:</strong> ${medicalOfficer}</p>
                <p>${excuseDutyText}</p>
                ${nextAppointment}
                <p>Contact Adamus IT for further assistance.</p>
                <p>Thank you for your attention.</p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export function generateHODNotification({
  staffName,
  treatmentCompletionDate,
  workStatus,
  excuseDutyDuration,
  reviewDate,
}: {
  staffName: string;
  treatmentCompletionDate: string;
  workStatus: string;
  excuseDutyDuration?: string;
  reviewDate?: string;
}): string {
  const nextAppointment = reviewDate
    ? `<p>The staff member is scheduled for a follow-up appointment on ${reviewDate}. Kindly ensure they attend as scheduled.</p>`
    : `<p>No further appointments are scheduled at this time.</p>`;

  const excuseDutyText = excuseDutyDuration
    ? `After the consultation, ${staffName} has been given  <strong>${workStatus}</strong> for a duration of <strong>${excuseDutyDuration} days.</strong>.`
    : `After the consultation, ${staffName} has been given <strong>${workStatus}</strong>.`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Completed Medical Treatment Notification</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
        @import url('https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://res.cloudinary.com/depow7mhg/image/upload/v1718463282/logo-black-text_idmjbv.png" alt="Company Logo" class="logo">
            <div class="header">
                <h1>Completed Medical Treatment Notification</h1>
            </div>
            <div class="content">
                <p>Dear Head of Department,</p>
                <p>We would like to inform you that the medical treatment for ${staffName}, which commenced on ${treatmentCompletionDate}, has been successfully completed.</p>
                <p>${excuseDutyText}</p>
                ${nextAppointment}
                <p>If you have any questions or need further information, please do not hesitate to contact us.</p>
                <p>Thank you for your attention.</p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export function generateDeclinedRequestNotification({
  staffName,
  requestDate,
  declinedBy,
}: {
  staffName: string;
  requestDate: string;
  declinedBy: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Declined Medical Request Notification</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
        @import url('https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #e53935;
                color: #ffffff;
                padding: 16px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px;
            }
            .header h1 {
                margin: 0;
                font-size: 22px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
        </style>
    </head>
    <body>
        <div class="container">
                        <img src="https://res.cloudinary.com/depow7mhg/image/upload/v1718463282/logo-black-text_idmjbv.png" alt="Company Logo" class="logo">

            <div class="header">
                <h1>Declined Medical Request Notification</h1>
            </div>
            <div class="content">
                <p>Dear ${staffName},</p>
                <p>We regret to inform you that your medical request, submitted on ${requestDate}, has been declined by ${declinedBy}</p>
                <p>Contact your supervisors for further clarification. Thank you for your understanding.</p>
                <p></p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export function generateSupervisorRequestNotification({
  staffName,
  supervisorName,
  requestDate,
  requestDetails,
}: {
  staffName: string;
  supervisorName: string;
  requestDate: string;
  requestDetails: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Supervisor Medical Request Notification</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
        @import url('https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #2196F3;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
        </style>
    </head>
    <body>
        <div class="container">
                        <img src="https://res.cloudinary.com/depow7mhg/image/upload/v1718463282/logo-black-text_idmjbv.png" alt="Company Logo" class="logo">

            <div class="header">
                <h1>Supervisor Medical Request Notification</h1>
            </div>
            <div class="content">
                <p>Dear ${staffName},</p>
                <p>This is to inform you that a medical request has been submitted on your behalf by your supervisor, ${supervisorName}, on ${requestDate}.</p>
                <p><strong>Supervisor:</strong> ${supervisorName}</p>
                <p><strong>Request Date:</strong> ${requestDate}</p>
                <p><strong>Request Details:</strong></p>
                <p>${requestDetails}</p>
                <p>If you have any questions or need further information, please contact the Adamus IT and Medical Officers.</p>
                <p>Thank you.</p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export function generateNewTreatmentNotification({
  managerName,
  staffName,
  requestDate,
  initialComplaint,
}: {
  managerName: string;
  staffName: string;
  requestDate: string;
  initialComplaint: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Treatment Initiated Notification</title>
        <link href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic" rel="stylesheet" />
        <style>
        @import url('https://fonts.googleapis.com/css?family=Montserrat:100,200,300,regular,500,600,700,800,900,100italic,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
        @import url('https://fonts.googleapis.com/css?family=Nunito:200,300,regular,500,600,700,800,900,200italic,300italic,italic,500italic,600italic,700italic,800italic,900italic');
            body {
                font-family: 'Nunito', sans-serif !important;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                font-family: 'Montserrat', sans-serif !important;
                border-radius: 5px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 20px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background-color: #f1f1f1;
                color: #777777;
                padding: 10px;
                text-align: center;
                font-size: 12px;
                border-radius: 8px;
            }
            .logo {
                display: block;
                margin: 20px auto;
                width: 100px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://asset.cloudinary.com/depow7mhg/0eb6e701cda8baba5c1fe665a7d0ee06" alt="Company Logo" class="logo">
            <div class="header">
                <h1>New Treatment Initiated Notification</h1>
            </div>
            <div class="content">
                <p>Dear ${managerName},</p>
                <p>We would like to inform you that a new treatment has been initiated by our medical officers for ${staffName} on ${requestDate}. Please find the details below:</p>
                <p><strong>Staff Name:</strong> ${staffName}</p>
                <p><strong>Initiation Date:</strong> ${requestDate}</p>
                <p><strong>Initial Complaints:</strong> ${initialComplaint}</p>
                <p>Please review the details at your earliest convenience.</p>
                <p>Contact Adamus IT for further assistance.</p>
                <p>Thank you for your attention.</p>
                <p>Best regards,</p>
                <p>Adamus IT and Medical Officers</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Adamus Resources Limited. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}
