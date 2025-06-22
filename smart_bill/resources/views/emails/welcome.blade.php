<!-- resources/views/emails/welcome.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Welcome Email</title>
</head>
<body>
    <h1>Welcome, {{ $customer->name }}!</h1>
    <p>Thank you for registering with us as a {{ $customer->customer_type }} customer.</p>
    
    <p>Your account details:</p>
    <ul>
        <li>Email: {{ $customer->email }}</li>
        @if($customer->phone_number)
        <li>Phone: {{ $customer->phone_number }}</li>
        @endif
        <li>Address: {{ $customer->address }}</li>
    </ul>

    <p>We're excited to have you on board!</p>
    
    <p>Best regards,<br>
    The Customer Support Team</p>
</body>
</html>