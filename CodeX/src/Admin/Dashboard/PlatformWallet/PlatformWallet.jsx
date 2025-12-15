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


  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("platform-wallet/");
      console.log(response.data);

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
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTransactions && filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 transform hover:-translate-y-1 hover:scale-[1.02]"
                    >
                      <div className="h-2 w-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300 group-hover:h-3"></div>

                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {transaction.user.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {transaction.user.email}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              transaction.transaction_type === "COURSE_PURCHASE"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {getTransactionLabel(transaction.transaction_type)}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-gray-700">
                            <DollarSign
                              size={18}
                              className="mr-2 text-green-500"
                            />
                            <span className="font-medium text-gray-900">
                              Amount:
                            </span>
                            <span className="ml-2 text-2xl font-bold text-green-600">
                              ${transaction.amount}
                            </span>
                          </div>

                          {transaction.tutor && (
                            <div className="flex items-center text-gray-700">
                              <User size={18} className="mr-2 text-green-500" />
                              <span className="font-medium text-gray-900">
                                Tutor:
                              </span>
                              <span className="ml-2 text-gray-900">
                                {transaction.tutor_name}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center text-gray-600">
                            <Calendar
                              size={18}
                              className="mr-2 text-green-500"
                            />
                            <span className="text-sm font-medium">
                              {new Date(
                                transaction.created_at
                              ).toLocaleDateString("en-US", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Transaction ID: #{transaction.id}
                            </span>
                            {getTransactionIcon(transaction.transaction_type)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <DollarSign
                      className="mx-auto mb-4 text-gray-600"
                      size={80}
                    />
                    <p className="text-gray-400 text-2xl font-medium">
                      No transactions found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PlatformWallet;
