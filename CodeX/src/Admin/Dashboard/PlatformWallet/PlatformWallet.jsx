import React, { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Calendar,
  ShoppingCart,
  CreditCard,
  User,
  BookOpen,
  Filter,
} from "lucide-react";
import Layout from "../Layout/Layout";
import { adminAxios } from "../../../../axiosConfig";
import Loading from "@/User/Components/Loading/Loading";

const PlatformWallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [coursePurchaseCount, setCoursePurchaseCount] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;


  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("platform-wallet/");

      setWalletData(response.data.wallet);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const coursePurchases = transactions.filter(
      (t) => t.transaction_type === "COURSE_PURCHASE"
    ).length;
    const subscriptions = transactions.filter(
      (t) => t.transaction_type === "SUBSCRIPTION"
    ).length;

    setCoursePurchaseCount(coursePurchases);
    setSubscriptionCount(subscriptions);

    // Filter transactions
    if (filter === "ALL") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter((t) => t.transaction_type === filter)
      );
    }
  }, [transactions, filter]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case "COURSE_PURCHASE":
        return <BookOpen size={18} className="text-green-500" />;
      case "SUBSCRIPTION":
        return <CreditCard size={18} className="text-green-500" />;
      default:
        return <DollarSign size={18} className="text-green-500" />;
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case "COURSE_PURCHASE":
        return "Course Purchase";
      case "SUBSCRIPTION":
        return "Subscription";
      default:
        return "Other";
    }
  };

    useEffect(() => {
    setCurrentPage(1);
  }, []);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const paginatedApps = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen  p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-5xl font-extrabold text-white mb-2">
                Platform Wallet
              </h1>
              <p className="text-gray-400 text-lg">
                Monitor your platform's revenue and transactions
              </p>
              <div className="h-1 w-40 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-4"></div>
            </div>

            {/* Wallet Balance Card */}
            <div className="mb-8 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24"></div>

                <div className="relative ">
                  <div className="flex items-center justify-between flex-wrap gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                        <Wallet size={40} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-1">
                          Total Revenue
                        </p>
                        <h1 className="text-6xl font-extrabold text-white">
                          ${walletData?.total_revenue.toFixed(2)}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                    <BookOpen size={32} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                      Course Purchases
                    </p>
                    <h2 className="text-4xl font-extrabold text-white mt-1">
                      {coursePurchaseCount}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-black to-gray-800 border-2 border-green-500 p-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500/20 p-4 rounded-full backdrop-blur-sm">
                    <CreditCard size={32} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
                      Subscriptions
                    </p>
                    <h2 className="text-4xl font-extrabold text-white mt-1">
                      {subscriptionCount}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mb-10 flex justify-center flex-wrap gap-4">
              <button
                onClick={() => setFilter("ALL")}
                className={`text-lg font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  filter === "ALL"
                    ? "bg-white text-black shadow-2xl"
                    : "bg-black text-white border-2 border-white hover:bg-white hover:text-black"
                }`}
              >
                <Filter className="inline mr-2" size={20} />
                All Transactions
                <span className="bg-green-500 text-white rounded-full px-3 py-1 ml-2">
                  {transactions.length}
                </span>
              </button>

              <button
                onClick={() => setFilter("COURSE_PURCHASE")}
                className={`text-lg font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  filter === "COURSE_PURCHASE"
                    ? "bg-white text-black shadow-2xl"
                    : "bg-black text-white border-2 border-white hover:bg-white hover:text-black"
                }`}
              >
                <BookOpen className="inline mr-2" size={20} />
                Course Purchases
                <span className="bg-green-500 text-white rounded-full px-3 py-1 ml-2">
                  {coursePurchaseCount}
                </span>
              </button>

              <button
                onClick={() => setFilter("SUBSCRIPTION")}
                className={`text-lg font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  filter === "SUBSCRIPTION"
                    ? "bg-white text-black shadow-2xl"
                    : "bg-black text-white border-2 border-white hover:bg-white hover:text-black"
                }`}
              >
                <CreditCard className="inline mr-2" size={20} />
                Subscriptions
                <span className="bg-green-500 text-white rounded-full px-3 py-1 ml-2">
                  {subscriptionCount}
                </span>
              </button>
            </div>

            {/* Transactions Grid */}
            <div>
  <h2 className="text-3xl font-extrabold text-white mb-6">
    Recent Transactions
  </h2>

  <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
            Type
          </th>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
            Amount
          </th>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
            Tutor
          </th>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
            Date
          </th>
          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
            Action
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {paginatedApps && paginatedApps.length > 0 ? (
          paginatedApps.map((transaction) => (
            <tr
              key={transaction.id}
              className="hover:bg-gray-50 transition"
            >


              <td className="px-6 py-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    transaction.transaction_type === "COURSE_PURCHASE"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {getTransactionLabel(transaction.transaction_type)}
                </span>
              </td>

              <td className="px-6 py-4 font-bold text-green-600">
                ${transaction.amount}
              </td>

              <td className="px-6 py-4 text-gray-800">
                {transaction.tutor_name || "—"}
              </td>

              <td className="px-6 py-4 text-gray-600 text-sm">
                {new Date(transaction.created_at).toLocaleDateString(
                  "en-US",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </td>

              <td className="px-6 py-4">
                {getTransactionIcon(transaction.transaction_type)}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center py-16">
              <DollarSign
                className="mx-auto mb-4 text-gray-400"
                size={64}
              />
              <p className="text-gray-400 text-xl font-medium">
                No transactions found
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
    <div className="flex justify-center items-center gap-2 mt-10">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-40"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg font-bold ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="px-4 py-2 rounded-lg bg-white text-black disabled:opacity-40"
      >
        Next
      </button>
    </div>

</div>

          </div>
        </div>
      )}
    </Layout>
  );
};

export default PlatformWallet;
