<?php

namespace App\Http\Controllers\Apps;

use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ProductController extends Controller implements HasMiddleware
{
    /**
     * middleware
     */
    public static function middleware()
    {
        return [
            new Middleware('permission:products-data', only: ['index']),
            new Middleware('permission:products-create', only: ['create', 'store']),
            new Middleware('permission:products-update', only: ['edit', 'update']),
            new Middleware('permission:products-delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // get all products
        $products = Product::query()
            ->when(request()->search, function($query) {
                $query->where('nama_produk', 'like', '%'. request()->search . '%');
            })
            ->when(request()->kategori, function($query) {
                $query->where('kategori', request()->kategori);
            })
            ->latest()
            ->get();

        // render view with products collection
        return inertia('Apps/Products/Index', [
            'products' => [
                'data' => $products
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Apps/Products/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        // upload image
        if ($request->hasFile('foto_produk')) {
            $image = $request->file('foto_produk');
            $filename = Str::random(32) . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/products', $filename);
        }

        // create product
        Product::create([
            'nama_produk' => $request->nama_produk,
            'deskripsi_produk' => $request->deskripsi_produk,
            'harga_produk' => $request->harga_produk,
            'komisi_produk' => $request->komisi_produk,
            'kategori' => $request->kategori,
            'foto_produk' => $filename ?? null,
        ]);

        // redirect
        return redirect()->route('apps.products.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return inertia('Apps/Products/Edit', [
            'product' => $product
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        // check if image is uploaded
        if ($request->hasFile('foto_produk')) {
            // upload new image
            $image = $request->file('foto_produk');
            $filename = Str::random(32) . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/products', $filename);

            // delete old image
            Storage::delete('public/products/'.$product->foto_produk);

            // update product with new image
            $product->update([
                'nama_produk' => $request->nama_produk,
                'deskripsi_produk' => $request->deskripsi_produk,
                'harga_produk' => $request->harga_produk,
                'komisi_produk' => $request->komisi_produk,
                'kategori' => $request->kategori,
                'foto_produk' => $filename
            ]);
        } else {
            // update product without image
            $product->update([
                'nama_produk' => $request->nama_produk,
                'deskripsi_produk' => $request->deskripsi_produk,
                'harga_produk' => $request->harga_produk,
                'komisi_produk' => $request->komisi_produk,
                'kategori' => $request->kategori
            ]);
        }

        // redirect
        return redirect()->route('apps.products.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // get product
        $product = Product::findOrFail($id);

        // delete image if exists
        if ($product->foto_produk) {
            Storage::delete('public/products/'.$product->getRawOriginal('foto_produk'));
        }

        // delete product
        $product->delete();

        // redirect
        return redirect()->route('apps.products.index');
    }
} 