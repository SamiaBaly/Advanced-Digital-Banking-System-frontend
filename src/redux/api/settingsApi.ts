
import { baseApi } from "./baseApi";

export interface BankSettings {
  _id: string;
  settingsKey: string;
  dailyTransferLimitPaisa: number;
  maxSingleTransactionPaisa: number;
  minimumAccountBalancePaisa: number;
  transferFeePaisa: number;
  allowTransfers: boolean;
  allowNewAccounts: boolean;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SettingsResponse {
  success: boolean;
  message: string;
  data: BankSettings;
}

export interface UpdateSettingsRequest {
  dailyTransferLimitPaisa?: number;
  maxSingleTransactionPaisa?: number;
  minimumAccountBalancePaisa?: number;
  transferFeePaisa?: number;
  allowTransfers?: boolean;
  allowNewAccounts?: boolean;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBankSettings: builder.query<SettingsResponse, void>({
      query: () => ({
        url: "/admin/settings",
        method: "GET",
      }),
      providesTags: ["BankSettings"],
    }),

    updateBankSettings: builder.mutation<
      SettingsResponse,
      UpdateSettingsRequest
    >({
      query: (body) => ({
        url: "/admin/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["BankSettings", "Dashboard"],
    }),
  }),
});

export const {
  useGetBankSettingsQuery,
  useUpdateBankSettingsMutation,
} = settingsApi;
