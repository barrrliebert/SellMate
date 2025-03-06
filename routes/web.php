<?php

use App\Http\Controllers\Apps\DashboardController;
use App\Http\Controllers\Apps\PermissionController;
use App\Http\Controllers\Apps\ProductController;
use App\Http\Controllers\Apps\RoleController;
use App\Http\Controllers\Apps\UserController;
use App\Http\Controllers\Apps\UserDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Apps\VideoController;
use App\Http\Controllers\Apps\ArticleController;
use App\Http\Controllers\Apps\OmzetController;
use App\Http\Controllers\Apps\TargetController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::group(['prefix' => 'apps', 'as' => 'apps.' , 'middleware' => ['auth']], function(){
    // dashboard route
    Route::get('/dashboard', DashboardController::class)->middleware('role:super-admin|roles-access|permission-access')->name('dashboard');
    
    // user dashboard route
    Route::get('/user-dashboard', [UserDashboardController::class, 'index'])->middleware('role:users-access')->name('user.dashboard');
    Route::get('/user-dashboard/omzet', [UserDashboardController::class, 'omzet'])->middleware('role:users-access')->name('user.omzet');
    Route::get('/user-dashboard/transactions', [UserDashboardController::class, 'transactions'])->middleware('role:users-access')->name('user.transactions');
    Route::get('/user-dashboard/commissions', [UserDashboardController::class, 'commissions'])->middleware('role:users-access')->name('user.commissions');
    Route::get('/user-dashboard/top-omzet', [UserDashboardController::class, 'topOmzet'])->middleware('role:users-access')->name('user.top-omzet');
    Route::get('/user-dashboard/target', [UserDashboardController::class, 'target'])->middleware('role:users-access')->name('user.target');
    Route::get('/user-dashboard/target/edit', [UserDashboardController::class, 'editTarget'])->middleware('role:users-access')->name('user.target.edit');
    
    // omzet routes
    Route::post('/omzets', [OmzetController::class, 'store'])->middleware('permission:omzet-create')->name('omzets.store');
    Route::get('/omzets/transaction-records', [OmzetController::class, 'getTransactionRecords'])->middleware('permission:omzet-data')->name('omzets.transactions');
    Route::get('/omzets/commission-records', [OmzetController::class, 'getCommissionRecords'])->middleware('permission:omzet-data')->name('omzets.commissions');
    Route::get('/omzets/top-omzet', [OmzetController::class, 'getTopOmzet'])->middleware('permission:omzet-data')->name('omzets.top');
    Route::get('/omzets/user-total', [OmzetController::class, 'getUserTotalOmzet'])->middleware('permission:omzet-data')->name('omzets.user-total');
    Route::get('/omzets/user-commission', [OmzetController::class, 'getUserTotalCommission'])->middleware('permission:omzet-data')->name('omzets.user-commission');
    Route::get('/omzets/user-weekly-average', [OmzetController::class, 'getUserWeeklyAverageOmzet'])->middleware('permission:omzet-data')->name('omzets.user-weekly-average');
    
    // target routes
    Route::post('/targets', [TargetController::class, 'store'])->middleware('permission:target-create')->name('targets.store');
    Route::put('/targets/{target}', [TargetController::class, 'update'])->middleware('permission:target-update')->name('targets.update');
    Route::delete('/targets/{target}', [TargetController::class, 'destroy'])->middleware('permission:target-delete')->name('targets.destroy');
    Route::get('/targets/current', [TargetController::class, 'getCurrentTarget'])->middleware('permission:target-data')->name('targets.current');
    
    // permissions route
    Route::get('/permissions', PermissionController::class)->name('permissions.index');
    // roles route
    Route::resource('/roles', RoleController::class)->except(['create', 'edit', 'show']);
    // users route
    Route::resource('/users', UserController::class)->except('show');

    // video route  
    Route::resource('/videos', VideoController::class);
    Route::resource('/article', ArticleController::class);
    // products route
    Route::resource('/products', ProductController::class)->except('show');
});

require __DIR__.'/auth.php';
