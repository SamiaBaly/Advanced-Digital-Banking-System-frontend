
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BankingTransaction {
  id: string;
  transactionId: string;

  type:
  | "deposit"
  | "withdrawal"
  | "fund_transfer"
  | "loan_disbursement"
  | "loan_repayment";

  amountPaisa: number;
  feePaisa: number;

  status: "pending" | "completed" | "failed" | "reversed";

  senderAccount?: string | null;
  receiverAccount?: string | null;

  description: string;
  createdAt: string;
}

interface TransactionState {
  transactions: BankingTransaction[];
  selectedTransactionId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  selectedTransactionId: null,
  isLoading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,

  reducers: {
    setTransactions: (
      state,
      action: PayloadAction<BankingTransaction[]>
    ) => {
      state.transactions = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setSelectedTransaction: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.selectedTransactionId = action.payload;
    },

    addTransaction: (
      state,
      action: PayloadAction<BankingTransaction>
    ) => {
      state.transactions.unshift(action.payload);
    },

    clearTransactions: (state) => {
      state.transactions = [];
      state.selectedTransactionId = null;
      state.isLoading = false;
      state.error = null;
    },

    setTransactionLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isLoading = action.payload;
    },

    setTransactionError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setTransactions,
  setSelectedTransaction,
  addTransaction,
  clearTransactions,
  setTransactionLoading,
  setTransactionError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
