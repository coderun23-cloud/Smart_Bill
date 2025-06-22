<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TariffController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReadingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\NotificationController;

Route::middleware(['auth:sanctum',])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'reset']);


Route::post('/contact', [ContactController::class, 'register']);
Route::get('/contact', [ContactController::class, 'displayMessage']);

Route::post('/logout',[AuthController::class,'logout'])->middleware('auth:sanctum');
Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
Route::put('/profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
Route::delete('/profile/{id}', [AuthController::class, 'deleteAccount']);

Route::apiResource('customer',CustomerController::class);
Route::apiResource('tariff',TariffController::class);
Route::apiResource('reading',ReadingController::class)->middleware('auth:sanctum');
Route::apiResource('report',ReportController::class)->middleware('auth:sanctum');
Route::apiResource('notification',NotificationController::class)->middleware('auth:sanctum');
Route::get('/users',[SuperAdminController::class,'users']);
Route::get('/detail/{id}',[ReadingController::class,'detail'])->middleware('auth:sanctum');
Route::get('/report_user',[ReportController::class,'report'])->middleware('auth:sanctum');

Route::apiResource('bill',BillController::class)->middleware('auth:sanctum');
Route::get('reading_details/{id}',[BillController::class,'reading'])->middleware('auth:sanctum');
Route::get('bills/{id}',[BillController::class,'getBillsByCustomer'])->middleware('auth:sanctum');
Route::apiResource('complaints',ComplaintController::class)->middleware('auth:sanctum');
Route::post('/pay', [PaymentController::class, 'store'])->middleware('auth:sanctum');
Route::post('/payment/callback', [PaymentController::class, 'callback'])->name('payment.callback')->middleware('auth:sanctum');
Route::get('/payment-success', [PaymentController::class, 'success'])->name('payment.success');
Route::get('/payment-failed', [PaymentController::class, 'failed'])->name('payment.failed');

