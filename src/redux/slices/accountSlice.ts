
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: "savings" | "current" | "business";
  balancePaisa: number;
  currency: "BDT";
  accountStatus: "active" | "frozen" | "blocked" | "closed";
  isPrimary: boolean;
}

interface AccountState {
  accounts: BankAccount[];
  selectedAccountId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  selectedAccountId: null,
  isLoading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,

  reducers: {
    setAccounts: (
      state,
      action: PayloadAction<BankAccount[]>
    ) => {
      state.accounts = action.payload;

      if (
        !state.selectedAccountId ||
        !state.accounts.some(
          (account) => account.id === state.selectedAccountId
        )
      ) {
        state.selectedAccountId =
          state.accounts.find((account) => account.isPrimary)?.id ||
          state.accounts[0]?.id ||
          null;
      }

      state.isLoading = false;
      state.error = null;
    },

    setSelectedAccount: (
      state,
      action: PayloadAction<string>
    ) => {
      const accountExists = state.accounts.some(
        (account) => account.id === action.payload
      );

      if (accountExists) {
        state.selectedAccountId = action.payload;
      }
    },

    clearAccounts: (state) => {
      state.accounts = [];
      state.selectedAccountId = null;
      state.isLoading = false;
      state.error = null;
    },

    setAccountLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isLoading = action.payload;
    },

    setAccountError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setAccounts,
  setSelectedAccount,
  clearAccounts,
  setAccountLoading,
  setAccountError,
} = accountSlice.actions;

export default accountSlice.reducer;
