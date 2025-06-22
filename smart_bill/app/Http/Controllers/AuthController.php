<?php

namespace App\Http\Controllers;


use Exception;
use App\Models\User;
use App\Models\Customer;
use Illuminate\Support\Str;
use App\Mail\AccountDeleted;
use Illuminate\Http\Request;
use App\Mail\UserWelcomeMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    //
public function register(Request $request)
{
    $fields = $request->validate([
        'name' => 'required|max:100',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|confirmed',
        'address' => 'required',
        'image' => 'nullable|string',
        'phone_number' => 'required|regex:/^251\d{9}$/|unique:users,phone_number',
        'role' => 'required',
    ], [
        'phone_number.regex' => 'The phone number must start with 251 followed by 9 digits (e.g., 251912345678).'
    ]);

    // Save raw password before hashing for email
    $rawPassword = $fields['password'];

    // Format phone number to ensure it starts with 251
    $phoneNumber = $fields['phone_number'];
    if (!str_starts_with($phoneNumber, '251')) {
        $phoneNumber = '251' . ltrim($phoneNumber, '0');
    }

    // Create user with hashed password
    $user = User::create([
        'name' => $fields['name'],
        'email' => $fields['email'],
        'password' => Hash::make($rawPassword),
        'address' => $fields['address'],
        'image' => $fields['image'],
        'phone_number' => $phoneNumber,
        'role' => $fields['role'],
    ]);

    // Create auth token
    $token = $user->createToken('auth_token')->plainTextToken;

    // Send email with user details and raw password
    Mail::to($user->email)->send(new UserWelcomeMail($user, $rawPassword));

    return response()->json([
        'user' => $user,
        'token' => $token,
    ], 201);
}
  public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    // Try logging in as a User
    $user = User::where('email', $request->email)->first();

    if ($user && Hash::check($request->password, $user->password)) {
        $token = $user->createToken($user->name);
        return response()->json([
            'account_type' => 'user',
            'role' => $user->role,
            'user' => $user,
            'token' => $token->plainTextToken,
        ]);
    }

    // Try logging in as a Customer
    $customer = Customer::where('email', $request->email)->first();

    if ($customer && Hash::check($request->password, $customer->password)) {
        $token = $customer->createToken($customer->name); // If using Sanctum on Customer too
        return response()->json([
            'account_type' => 'customer',
            'user' => $customer,
            'token' => $token->plainTextToken,
        ]);
    }

    // If neither matched
    return response()->json([
        'errors' => [
            'email' => ['The provided credentials are incorrect.']
        ]
    ], 401);
}



   public function logout(Request $request)
{
    try {
        $accessToken = $request->bearerToken();

        if (!$accessToken) {
            return response()->json(['message' => 'No bearer token provided'], 400);
        }

        $token = PersonalAccessToken::findToken($accessToken);

        if (!$token) {
            return response()->json(['message' => 'Token not found'], 404);
        }

        $token->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    } catch (Exception $e) {
        Log::error('Logout error: ' . $e->getMessage());
        return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
    }
}

    public function profile(Request $request)
{
    return response()->json(Auth::user());
}
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'address'=>'required',
            'phone_number'=>'required'
        ]);

        $user->update($data);

        return response()->json($user);
    }

   public function deleteAccount(Request $request, $id)
{
    $reason = $request->input('reason');

    $user = User::findOrFail($id);

    \Log::info("User deleted. ID: {$user->id}, Reason: {$reason}");

    $user->tokens()->delete();
    $user->delete();
        Mail::to($user->email)->send(new AccountDeleted($user));

    return response()->json(['message' => 'Account deleted successfully']);
}
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        if (User::where('email', $email)->exists()) {
            $status = Password::broker('users')->sendResetLink(['email' => $email]);
        }
        elseif (Customer::where('email', $email)->exists()) {
            $status = Password::broker('customers')->sendResetLink(['email' => $email]);
        }
        else {
            return response()->json(['message' => 'We can’t find a user with that email address.'], 404);
        }

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Password reset link sent!'])
            : response()->json(['message' => 'Failed to send reset link.'], 400);
    }
public function reset(Request $request)
{
    $request->validate([
        'token'    => 'required',
        'email'    => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $email = $request->email;

    $user = User::where('email', $email)->first();
    if ($user) {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, $password) {
                $user->forceFill([
                    'password'       => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        return $status == Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    $customer = Customer::where('email', $email)->first();
    if ($customer) {
        $tokenData = DB::table('password_resets')->where('email', $email)->first();

        if (!$tokenData || !Hash::check($request->token, $tokenData->token)) {
            return response()->json(['message' => 'Invalid or expired token'], 400);
        }

        $customer->password = Hash::make($request->password);
        $customer->save();

        DB::table('password_resets')->where('email', $email)->delete();

        return response()->json(['message' => 'Password reset successful']);
    }

    return response()->json(['message' => 'No account found for this email'], 404);
}
    

}
