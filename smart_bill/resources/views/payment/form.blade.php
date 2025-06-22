<!DOCTYPE html>
<html>
<head>
    <title>Chapa Payment Form</title>
    <meta charset="UTF-8">
</head>
<body>
    <a href="{{ route('login.google') }}" class="btn btn-danger">Sign in with Google</a>

    <h2>💳 Make a Payment</h2>

    @if(session('error'))
        <p style="color: red">{{ session('error') }}</p>
    @endif

    @if($errors->any())
        <ul style="color: red">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    @endif

    <form method="POST" action="{{ route('payment.pay') }}">
        @csrf

        <label>First Name:</label><br>
        <input type="text" name="first_name" required><br><br>

        <label>Last Name:</label><br>
        <input type="text" name="last_name" required><br><br>

        <label>Email Address:</label><br>
        <input type="email" name="email" required><br><br>

        <label>Amount (ETB):</label><br>
        <input type="number" name="amount" min="1" required><br><br>
        <label>Phone Number:</label><br>
        <input type="text" name="phone" required placeholder="e.g., 2519xxxxxxxx"><br><br>

        <button type="submit">Pay Now</button>
    </form>
</body>
</html>
