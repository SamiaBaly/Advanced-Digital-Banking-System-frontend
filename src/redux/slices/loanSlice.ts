
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BankingLoan {
  id: string;

  loanType:
  | "personal"
  | "business"
  | "education"
  | "home"
  | "other";

  requestedAmountPaisa: number;
  approvedAmountPaisa: number | null;

  durationMonths: number;

  status:
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "active"
  | "completed";

  outstandingBalancePaisa: number | null;
  monthlyInstallmentPaisa: number | null;

  createdAt: string;
}

interface LoanState {
  loans: BankingLoan[];
  selectedLoanId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LoanState = {
  loans: [],
  selectedLoanId: null,
  isLoading: false,
  error: null,
};

const loanSlice = createSlice({
  name: "loan",
  initialState,

  reducers: {
    setLoans: (
      state,
      action: PayloadAction<BankingLoan[]>
    ) => {
      state.loans = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    setSelectedLoan: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.selectedLoanId = action.payload;
    },

    clearLoans: (state) => {
      state.loans = [];
      state.selectedLoanId = null;
      state.isLoading = false;
      state.error = null;
    },

    setLoanLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isLoading = action.payload;
    },

    setLoanError: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setLoans,
  setSelectedLoan,
  clearLoans,
  setLoanLoading,
  setLoanError,
} = loanSlice.actions;

export default loanSlice.reducer;
