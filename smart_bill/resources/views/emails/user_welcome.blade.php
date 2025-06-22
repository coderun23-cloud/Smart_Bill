<h2>Hello {{ $user->name }},</h2>
<p>Your account has been successfully created with the following details:</p>
<ul>
    <li><strong>Email:</strong> {{ $user->email }}</li>
    <li><strong>Password:</strong> {{ $password }}</li>
    <li><strong>Role:</strong> {{ ucfirst($user->role) }}</li>
    <li><strong>Address:</strong> {{ $user->address }}</li>
    <li><strong>Phone Number:</strong> {{ $user->phone_number }}</li>
</ul>
<p>Please keep this information secure.</p>
