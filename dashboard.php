<?php
// Memanggil header (layout atas & semantic HTML)
include 'includes/header.php';
?>

<main class="container mx-auto px-4 py-6">
    <section class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Dashboard MyBudgetGue</h1>
        <p class="text-gray-600">Ringkasan keuangan dan status anggaran harianmu.</p>
    </section>

    <!-- Kotak Indikator Visual Status Anggaran (Sesuai syarat proyek) -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <h3 class="text-gray-500 text-sm font-semibold">Total Saldo</h3>
            <p class="text-2xl font-bold text-gray-800">Rp 0</p>
            <span class="text-xs text-green-600 font-medium">Status: Aman</span>
        </div>
        <div class="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <h3 class="text-gray-500 text-sm font-semibold">Pengeluaran Bulan Ini</h3>
            <p class="text-2xl font-bold text-gray-800">Rp 0</p>
            <span class="text-xs text-yellow-600 font-medium">Status: Mendekati Batas</span>
        </div>
        <div class="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
            <h3 class="text-gray-500 text-sm font-semibold">Sisa Anggaran</h3>
            <p class="text-2xl font-bold text-gray-800">Rp 0</p>
            <span class="text-xs text-red-600 font-medium">Status: Kritis / Terlampaui</span>
        </div>
    </section>
</main>

<?php
// Memanggil footer (layout bawah)
include 'includes/footer.php';
?>