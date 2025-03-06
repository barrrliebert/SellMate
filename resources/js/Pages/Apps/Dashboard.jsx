import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/Components/Button";
import Widget from "@/Components/Widget";
import Table from "@/Components/Table";
import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import {
    IconBox,
    IconChartBar,
    IconUsers,
    IconDownload,
    IconCalendar,
    IconWallet,
} from "@tabler/icons-react";
import OmzetModal from "@/Pages/Apps/DateOmzetModal";

export default function Dashboard() {
    const [omzetList, setOmzetList] = useState([]);
    const [loadingOmzet, setLoadingOmzet] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    // state untuk interval filter, jika null maka data default digunakan
    const [filterDates, setFilterDates] = useState(null);

    // Fungsi untuk format tanggal ke YYYY-MM-DD
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const exportTodayData = () => {
        const today = new Date();
        const todayStr = formatDate(today);
        const url = `/apps/laporan/omzet?start_date=${todayStr}&end_date=${todayStr}`;
        window.open(url, "_blank");
    };

    // Ambil data omzet secara default atau sesuai filter
    useEffect(() => {
        const fetchOmzet = async () => {
            setLoadingOmzet(true);
            try {
                const response = await axios.get("/apps/omzets/top-omzet");
                setOmzetList(response.data.top_users);
            } catch (error) {
                console.error("Error fetching omzet data:", error);
            }
            setLoadingOmzet(false);
        };

        fetchOmzet();
    }, []);

    // Fungsi Export PDF menggunakan filter jika tersedia
    const exportPDF = () => {
        let url = "/apps/laporan/omzet";
        if (filterDates) {
            url += `?start_date=${formatDate(
                filterDates.start
            )}&end_date=${formatDate(filterDates.end)}`;
        }
        window.open(url, "_blank");
    };

    // Konfirmasi pilihan interval; cukup update state filterDates dan tutup modal
    const confirmInterval = () => {
        setFilterDates({ start: startDate, end: endDate });
        setShowModal(false);
    };

    // Fungsi untuk mendapatkan grade berdasarkan formatted omzet
    const getGrade = (formattedOmzet) => {
        const value = parseInt(formattedOmzet.replace(/\D/g, ""));
        if (value >= 300000) return { grade: "A", color: "bg-green-500" };
        if (value >= 200000) return { grade: "B", color: "bg-blue-500" };
        if (value >= 100000) return { grade: "C", color: "bg-yellow-500" };
        return { grade: "D", color: "bg-red-500" };
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex justify-end gap-4 mb-4">
                <Button
                    type="button"
                    variant="orange"
                    label="Export PDF"
                    icon={<IconDownload size={20} strokeWidth={1.5} />}
                    onClick={exportPDF}
                />
                <Button
                    type="button"
                    variant="orange"
                    label="Set Interval"
                    icon={<IconCalendar size={20} strokeWidth={1.5} />}
                    onClick={() => setShowModal(true)}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Widget
                    title={"Total Omzet"}
                    subtitle={"Total Pemasukan"}
                    color={
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    }
                    icon={<IconWallet size={20} strokeWidth={1.5} />}
                    total={
                        <>
                            <sup>Rp</sup> 2.000.000
                        </>
                    }
                />
                <Widget
                    title={"Produk"}
                    subtitle={"Total Produk Unggulan"}
                    color={
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    }
                    icon={<IconBox size={20} strokeWidth={1.5} />}
                    total={4}
                />
                <Widget
                    title={"Pengguna"}
                    subtitle={"Total Pengguna"}
                    color={
                        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    }
                    icon={<IconUsers size={20} strokeWidth={1.5} />}
                    total={30}
                />
            </div>

            <div className="grid grid-cols-4 gap-4 mt-5 items-start">
                {/* Top Omzet Table dengan kolom tambahan Grade */}
                <div className="col-span-4 md:col-span-2">
                    <Table.Card
                        title={"Top Omzet"}
                        icon={<IconChartBar size={20} strokeWidth={1.5} />}
                    >
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th className="w-10">No</Table.Th>
                                    <Table.Th>Nama</Table.Th>
                                    <Table.Th>Jurusan</Table.Th>
                                    <Table.Th className="text-center">
                                        Total Omzet
                                    </Table.Th>
                                    <Table.Th className="text-center">
                                        Grade
                                    </Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {loadingOmzet ? (
                                    <tr>
                                        <Table.Td
                                            colSpan={5}
                                            className="text-center"
                                        >
                                            Loading...
                                        </Table.Td>
                                    </tr>
                                ) : omzetList.length > 0 ? (
                                    omzetList.map((item, i) => {
                                        const { grade, color } = getGrade(
                                            item.formatted_omzet
                                        );
                                        return (
                                            <tr
                                                key={i}
                                                className="hover:bg-gray-100 dark:hover:bg-gray-900"
                                            >
                                                <Table.Td className="text-center">
                                                    {i + 1}
                                                </Table.Td>
                                                <Table.Td>{item.name}</Table.Td>
                                                <Table.Td>
                                                    {item.major}
                                                </Table.Td>
                                                <Table.Td className="text-center">
                                                    {item.formatted_omzet}
                                                </Table.Td>
                                                <Table.Td className="text-center">
                                                    <span
                                                        className={`${color} rounded px-2 py-1 text-xs font-bold text-white`}
                                                    >
                                                        {grade}
                                                    </span>
                                                </Table.Td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <Table.Td
                                            colSpan={5}
                                            className="text-center"
                                        >
                                            Belum ada data omzet
                                        </Table.Td>
                                    </tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.Card>
                </div>

                {/* Histori Transaksi Omzet Table dengan kolom Tanggal */}
                <div className="col-span-4 md:col-span-2">
                    <Table.Card
                        title={"Histori Transaksi Omzet"}
                        icon={<IconChartBar size={20} strokeWidth={1.5} />}
                    >
                        <Table>
                            <Table.Thead>
                                <tr>
                                    <Table.Th>Nama</Table.Th>
                                    <Table.Th>Jurusan</Table.Th>
                                    <Table.Th className="text-center">
                                        Total Omzet
                                    </Table.Th>
                                    <Table.Th className="text-center">
                                        Tanggal
                                    </Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {loadingOmzet ? (
                                    <tr>
                                        <Table.Td
                                            colSpan={4}
                                            className="text-center"
                                        >
                                            Loading...
                                        </Table.Td>
                                    </tr>
                                ) : omzetList.length > 0 ? (
                                    omzetList.map((item, i) => {
                                        // Asumsikan properti "tanggal" sudah tersedia di item
                                        // Pastikan properti tanggal di item tersedia dan valid
                                        const tgl = item.tanggal
                                            ? new Date(
                                                  item.tanggal
                                              ).toLocaleDateString("id-ID", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "-";
                                        return (
                                            <tr
                                                key={i}
                                                className="hover:bg-gray-100 dark:hover:bg-gray-900"
                                            >
                                                <Table.Td>{item.name}</Table.Td>
                                                <Table.Td>
                                                    {item.major}
                                                </Table.Td>
                                                <Table.Td className="text-center">
                                                    {item.formatted_omzet}
                                                </Table.Td>
                                                <Table.Td className="text-center">
                                                    {tgl}
                                                </Table.Td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <Table.Td
                                            colSpan={4}
                                            className="text-center"
                                        >
                                            Belum ada data transaksi omzet
                                        </Table.Td>
                                    </tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.Card>
                </div>
            </div>

            <OmzetModal
                show={showModal}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onCancel={() => setShowModal(false)}
                onConfirm={confirmInterval}
                onExportToday={exportTodayData}
            />
        </>
    );
}

Dashboard.layout = (page) => <AppLayout children={page} />;
