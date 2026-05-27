<?php

header('Content-Type: application/json');

// ==============================
// ONLY POST ALLOWED
// ==============================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "status" => "error",
        "message" => "Invalid request"
    ]);

    exit;
}

// ==============================
// HONEYPOT CHECK
// ==============================

if (!empty($_POST['website'])) {

    echo json_encode([
        "status" => "error",
        "message" => "Spam detected"
    ]);

    exit;
}

// ==============================
// SANITIZE FUNCTION
// ==============================

function clean($data) {

    return htmlspecialchars(
        trim($data),
        ENT_QUOTES,
        'UTF-8'
    );
}

// ==============================
// GET FORM DATA
// ==============================

$name    = clean($_POST['name'] ?? '');
$phone   = preg_replace('/[^0-9]/', '', $_POST['phone'] ?? '');
$email   = clean($_POST['email'] ?? '');
$case    = clean($_POST['case'] ?? '');
$company = clean($_POST['company'] ?? '');

// ==============================
// VALIDATION
// ==============================

if (
    empty($name) ||
    empty($phone) ||
    empty($email) ||
    empty($case)
) {

    echo json_encode([
        "status" => "error",
        "message" => "All required fields are mandatory"
    ]);

    exit;
}

// PHONE VALIDATION

if (strlen($phone) != 10) {

    echo json_encode([
        "status" => "error",
        "message" => "Phone number must be exactly 10 digits"
    ]);

    exit;
}

// EMAIL VALIDATION

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    echo json_encode([
        "status" => "error",
        "message" => "Invalid email address"
    ]);

    exit;
}

// ==============================
// DUPLICATE EMAIL CHECK
// ==============================

$file = "emails.txt";

if (!file_exists($file)) {

    file_put_contents($file, '');
}

$existingEmails = file($file, FILE_IGNORE_NEW_LINES);

if (in_array(strtolower($email), array_map('strtolower', $existingEmails))) {

    echo json_encode([
        "status" => "exists",
        "message" => "Email already exists"
    ]);

    exit;
}

// SAVE EMAIL
file_put_contents(
    $file,
    strtolower($email) . PHP_EOL,
    FILE_APPEND
);

// ==============================
// EMAIL SETTINGS
// ==============================

$to = "sriethiraj@getnos.io";

$subject = "New Valuation Lead Received - Clearclaim";

// ==============================
// HTML EMAIL TEMPLATE
// ==============================

$message = '
<html>
<head>
  <title>Clearclaim - New Lead</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f4f7fb;">

<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:18px;overflow:hidden;">

<tr>
<td style="background:linear-gradient(135deg,#00BE5D,#00984A);padding:28px;text-align:center;">

<h1 style="margin:0;color:#ffffff;font-size:28px;">
New Valuation Lead
</h1>

<p style="margin:8px 0 0;color:#dcffe9;font-size:14px;">
A new user submitted the valuation form
</p>

</td>
</tr>

<tr>
<td style="padding:35px;">

<table width="100%" cellpadding="12" cellspacing="0" style="border-collapse:collapse;">

<tr>
<td style="font-weight:bold;border-bottom:1px solid #edf1f5;width:180px;">
Full Name
</td>

<td style="border-bottom:1px solid #edf1f5;">
'.$name.'
</td>
</tr>

<tr>
<td style="font-weight:bold;border-bottom:1px solid #edf1f5;">
Phone Number
</td>

<td style="border-bottom:1px solid #edf1f5;">
'.$phone.'
</td>
</tr>

<tr>
<td style="font-weight:bold;border-bottom:1px solid #edf1f5;">
Email Address
</td>

<td style="border-bottom:1px solid #edf1f5;">
'.$email.'
</td>
</tr>

<tr>
<td style="font-weight:bold;border-bottom:1px solid #edf1f5;">
Case Type
</td>

<td style="border-bottom:1px solid #edf1f5;">
'.$case.'
</td>
</tr>

<tr>
<td style="font-weight:bold;border-bottom:1px solid #edf1f5;">
Company Name
</td>

<td style="border-bottom:1px solid #edf1f5;">
'.(!empty($company) ? $company : 'Not Provided').'
</td>
</tr>

<tr>
<td style="font-weight:bold;">
Submitted At
</td>

<td>
'.date("d M Y h:i A").'
</td>
</tr>

</table>

</td>
</tr>

<tr>
<td style="background:#f8fafc;padding:18px;text-align:center;font-size:13px;color:#6b7280;">
Â© '.date("Y").' Valuation Lead System
</td>
</tr>

</table>

</td>
</tr>

</table>

</body>
</html>
';

// ==============================
// EMAIL HEADERS
// ==============================

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: Clearclaim <hello@getnos.io>\r\n";
$headers .= "Reply-To: ".$email."\r\n";

// ==============================
// SEND EMAIL
// ==============================

$mailSent = mail(
    $to,
    $subject,
    $message,
    $headers
);

// ==============================
// RESPONSE
// ==============================

if ($mailSent) {

    echo json_encode([
        "status" => "success",
        "message" => "Lead submitted successfully"
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Email sending failed"
    ]);
}

?>