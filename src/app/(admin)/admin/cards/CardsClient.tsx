
"use client";

import { useState } from "react";
import {
  CreditCard,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import {
  useGetCardsQuery,
  useUpdateCardStatusMutation,
  type CardStatus,
} from "@/redux/api/cardApi";

const formatMoney = (paisa: number) =>
  `৳${(paisa / 100).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

const statusStyles: Record<CardStatus, string> = {
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  active:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  blocked:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  expired:
    "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400",
  cancelled:
    "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function CardsClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [cardType, setCardType] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCardsQuery({
      page,
      limit: 10,
      search,
      cardType,
      status,
    });

  const [updateCardStatus, { isLoading: isUpdating }] =
    useUpdateCardStatusMutation();

  const cards = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination;

  const debitCount = cards.filter(
    (card) => card.cardType === "debit"
  ).length;

  const creditCount = cards.filter(
    (card) => card.cardType === "credit"
  ).length;

  const activeCount = cards.filter(
    (card) => card.cardStatus === "active"
  ).length;

  const handleStatusChange = async (
    id: string,
    cardStatus: CardStatus
  ) => {
    try {
      await updateCardStatus({ id, cardStatus }).unwrap();
    } catch (error) {
      console.error("Card status update failed:", error);
      alert("Failed to update card status.");
    }
  };

  const summaryCards = [
    {
      label: "Total Cards",
      value: pagination?.total ?? 0,
      icon: CreditCard,
      color: "text-[#176B87]",
      bg: "bg-[#176B87]/10",
    },
    {
      label: "Debit Cards",
      value: debitCount,
      icon: Wallet,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Credit Cards",
      value: creditCount,
      icon: CreditCard,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Active Cards",
      value: activeCount,
      icon: ShieldCheck,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-500/10",
    },
  ];

  const sectionClass =
    "rounded-2xl border border-[#E2E8F0] bg-white shadow-sm dark:border-[#29445E] dark:bg-[#14283D]";

  return (
    <div className="min-h-screen bg-[#F4F7FB] p-4 pt-20 text-[#172B4D] dark:bg-[#0B1726] dark:text-[#F4F7FB] sm:p-6 sm:pt-24 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#14B8A6]/10 p-3 text-[#14B8A6]">
              <CreditCard size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-[#102A43] dark:text-white">
                Cards Management
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage customer debit and credit cards
              </p>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#176B87] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#102A43] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#14B8A6] dark:text-[#102A43] dark:hover:bg-[#0FAE9E]"
          >
            <RefreshCw
              size={16}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`${sectionClass} p-5`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                      {item.value}
                    </h2>
                  </div>

                  <div className={`shrink-0 rounded-xl p-3 ${item.bg} ${item.color}`}>
                    <Icon size={23} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <section className={`${sectionClass} p-5`}>
          <div className="mb-4">
            <h2 className="font-bold">Search & Filters</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Find cards by customer, card type or status
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search customer or last 4 digits..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 bg-[#F4F7FB] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/10 dark:border-[#29445E] dark:bg-[#102A43]"
              />
            </div>

            <select
              value={cardType}
              onChange={(e) => {
                setCardType(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-200 bg-[#F4F7FB] px-3 py-3 text-sm outline-none transition focus:border-[#14B8A6] dark:border-[#29445E] dark:bg-[#102A43]"
            >
              <option value="">All Card Types</option>
              <option value="debit">Debit Card</option>
              <option value="credit">Credit Card</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-200 bg-[#F4F7FB] px-3 py-3 text-sm outline-none transition focus:border-[#14B8A6] dark:border-[#29445E] dark:bg-[#102A43]"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </section>

        {/* Cards Table */}
        <section className={`${sectionClass} overflow-hidden`}>
          <div className="flex flex-col justify-between gap-2 border-b border-[#E2E8F0] p-5 dark:border-[#29445E] sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold">All Cards</h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Customer card information and status
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#176B87]/10 px-3 py-1.5 text-xs font-semibold text-[#176B87] dark:text-[#14B8A6]">
              {pagination?.total ?? 0} Cards
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-gray-500 dark:text-gray-400">
              <RefreshCw size={17} className="animate-spin" />
              Loading cards...
            </div>
          ) : isError ? (
            <div className="p-12 text-center">
              <p className="text-sm font-medium text-red-500">
                Failed to load cards.
              </p>

              <button
                onClick={() => refetch()}
                className="mt-4 rounded-xl bg-[#176B87] px-4 py-2 text-sm font-semibold text-white hover:bg-[#102A43]"
              >
                Try Again
              </button>
            </div>
          ) : cards.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard
                size={35}
                className="mx-auto mb-3 text-gray-400"
              />
              <p className="font-semibold">No cards found</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-[#F4F7FB] text-xs uppercase text-gray-500 dark:bg-[#102A43] dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-4">Cardholder</th>
                    <th className="px-5 py-4">Card Number</th>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Network</th>
                    <th className="px-5 py-4">Linked Account</th>
                    <th className="px-5 py-4">Expiry</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Update Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#29445E]">
                  {cards.map((card) => (
                    <tr
                      key={card._id}
                      className="transition hover:bg-[#F4F7FB]/70 dark:hover:bg-[#102A43]/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {card.cardHolderName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {card.owner?.email || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium">
                        •••• {card.cardNumberLast4}
                      </td>

                      <td className="px-5 py-4 capitalize">
                        {card.cardType}
                      </td>

                      <td className="px-5 py-4 uppercase">
                        {card.cardNetwork}
                      </td>

                      <td className="px-5 py-4">
                        {card.linkedAccount?.accountNumber || "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        {String(card.expiryMonth).padStart(2, "0")}/
                        {card.expiryYear}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[card.cardStatus]
                            }`}
                        >
                          {card.cardStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={card.cardStatus}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleStatusChange(
                              card._id,
                              e.target.value as CardStatus
                            )
                          }
                          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-[#14B8A6] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#29445E] dark:bg-[#102A43]"
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="blocked">Blocked</option>
                          <option value="expired">Expired</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-col justify-between gap-3 border-t border-[#E2E8F0] p-4 dark:border-[#29445E] sm:flex-row sm:items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Page {pagination?.page ?? page} of{" "}
              {pagination?.totalPages ?? 1}
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() =>
                  setPage((prev) => Math.max(1, prev - 1))
                }
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium transition hover:bg-[#F4F7FB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29445E] dark:hover:bg-[#102A43]"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <button
                disabled={
                  !pagination ||
                  page >= pagination.totalPages ||
                  isFetching
                }
                onClick={() => setPage((prev) => prev + 1)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium transition hover:bg-[#F4F7FB] disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#29445E] dark:hover:bg-[#102A43]"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
