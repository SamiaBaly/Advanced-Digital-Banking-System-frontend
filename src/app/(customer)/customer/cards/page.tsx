
"use client";

import { useState } from "react";
import {
  CreditCard,
  Wallet,
  RefreshCw,
  ShieldCheck,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useGetMyCardsQuery,
  type BankCard,
  type CardStatus,
} from "@/redux/api/cardApi";

const formatBDT = (paisa: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format((paisa || 0) / 100);

const statusStyle: Record<CardStatus, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  blocked: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  expired: "bg-gray-200 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
  cancelled: "bg-gray-200 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
};

function CardDesign({ card }: { card: BankCard }) {
  const isCredit = card.cardType === "credit";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl ${isCredit
          ? "bg-gradient-to-br from-[#102A43] via-[#176B87] to-[#14B8A6]"
          : "bg-gradient-to-br from-[#102A43] via-[#176B87] to-[#254D70]"
        }`}
    >
      <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[25px] border-white/10" />
      <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full border-[25px] border-white/10" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-white/70">
            Advanced Digital Banking
          </p>
          <p className="mt-2 text-lg font-semibold capitalize">
            {card.cardType} Card
          </p>
        </div>
        <span className="text-xl font-bold uppercase italic">
          {card.cardNetwork}
        </span>
      </div>

      <div className="relative mt-10">
        <CreditCard size={30} className="mb-4 text-white/80" />
        <p className="text-xl tracking-[0.25em]">
          •••• •••• •••• {card.cardNumberLast4}
        </p>
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/60">
            Card Holder
          </p>
          <p className="mt-1 text-sm font-semibold uppercase">
            {card.cardHolderName}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/60">
            Expires
          </p>
          <p className="mt-1 text-sm font-semibold">
            {String(card.expiryMonth).padStart(2, "0")}/{card.expiryYear}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CustomerCardsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [cardType, setCardType] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetMyCardsQuery({
      page,
      limit: 6,
      status,
      cardType,
    });

  const cards = data?.data ?? [];
  const pagination = data?.pagination;

  const activeCount = cards.filter(
    (card) => card.cardStatus === "active"
  ).length;

  const creditCount = cards.filter(
    (card) => card.cardType === "credit"
  ).length;

  const debitCount = cards.filter(
    (card) => card.cardType === "debit"
  ).length;

  return (
    <div className="min-h-screen space-y-6 bg-[#F4F7FB] p-4 text-[#172B4D] dark:bg-[#0B1726] dark:text-white sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Cards</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and view your debit and credit cards.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:border-[#29445E] dark:bg-[#14283D] dark:hover:bg-[#1B354D]"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Cards", value: pagination?.total ?? 0, icon: CreditCard },
          { label: "Active Cards", value: activeCount, icon: ShieldCheck },
          { label: "Debit Cards", value: debitCount, icon: Wallet },
          { label: "Credit Cards", value: creditCount, icon: CreditCard },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-[#243B53] dark:bg-[#14283D]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <item.icon className="text-[#14B8A6]" size={21} />
            </div>
            <p className="mt-3 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={cardType}
          onChange={(e) => {
            setCardType(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none dark:border-[#29445E] dark:bg-[#14283D]"
        >
          <option value="">All Card Types</option>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none dark:border-[#29445E] dark:bg-[#14283D]"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-white p-12 text-center dark:bg-[#14283D]">
          Loading your cards...
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-white p-10 text-center dark:bg-[#14283D]">
          <p className="text-red-500">Failed to load your cards.</p>
          <button onClick={() => refetch()} className="mt-3 text-[#14B8A6]">
            Try again
          </button>
        </div>
      ) : cards.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center dark:border-[#243B53] dark:bg-[#14283D]">
          <CreditCard className="mx-auto text-[#14B8A6]" size={42} />
          <h2 className="mt-4 text-lg font-bold">No Cards Found</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You dont have any cards matching these filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card._id}
                className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-[#243B53] dark:bg-[#14283D]"
              >
                <CardDesign card={card} />

                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle[card.cardStatus]
                      }`}
                  >
                    {card.cardStatus}
                  </span>
                  <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    {card.cardNetwork}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F4F7FB] p-3 dark:bg-[#0B1726]">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Linked Account
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {card.linkedAccount?.accountNumber
                        ? `•••• ${card.linkedAccount.accountNumber.slice(-4)}`
                        : "Unavailable"}
                    </p>
                    <p className="text-xs capitalize text-gray-500">
                      {card.linkedAccount?.accountType ?? ""}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F4F7FB] p-3 dark:bg-[#0B1726]">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Daily Limit
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatBDT(card.dailyLimitPaisa)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F4F7FB] p-3 dark:bg-[#0B1726]">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Monthly Limit
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {formatBDT(card.monthlyLimitPaisa)}
                    </p>
                  </div>

                  {card.cardType === "credit" && (
                    <div className="rounded-xl bg-[#F4F7FB] p-3 dark:bg-[#0B1726]">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Available Credit
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {formatBDT(card.availableCreditPaisa)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Limit: {formatBDT(card.creditLimitPaisa)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-[#29445E] dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    {card.cardStatus === "active" ? (
                      <ShieldCheck size={14} />
                    ) : card.cardStatus === "pending" ? (
                      <Clock size={14} />
                    ) : (
                      <Ban size={14} />
                    )}
                    {card.cardType.toUpperCase()} CARD
                  </span>
                  <span>
                    Issued:{" "}
                    {new Date(card.issuedAt).toLocaleDateString("en-BD")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-[#243B53] dark:bg-[#14283D]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination?.page ?? page} of {pagination?.totalPages ?? 1}
              {" · "}
              {pagination?.total ?? 0} cards
            </p>

            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-gray-200 p-2 disabled:opacity-40 dark:border-[#29445E]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={!pagination || page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-gray-200 p-2 disabled:opacity-40 dark:border-[#29445E]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
