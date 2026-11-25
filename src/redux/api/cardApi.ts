
import { baseApi } from "./baseApi";

export type CardType = "debit" | "credit";

export type CardStatus =
  | "pending"
  | "active"
  | "blocked"
  | "expired"
  | "cancelled";

export interface CardOwner {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface CardAccount {
  _id: string;
  accountNumber: string;
  accountType: string;
  accountStatus?: string;
}

export interface BankCard {
  _id: string;
  owner: CardOwner;
  linkedAccount: CardAccount;
  cardHolderName: string;
  cardType: CardType;
  cardNetwork: "visa" | "mastercard";
  cardNumberLast4: string;
  expiryMonth: number;
  expiryYear: number;
  cardStatus: CardStatus;
  dailyLimitPaisa: number;
  monthlyLimitPaisa: number;
  creditLimitPaisa: number;
  availableCreditPaisa: number;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardsResponse {
  success: boolean;
  data: BankCard[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CardQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  cardType?: string;
}

export interface UpdateCardStatusRequest {
  id: string;
  cardStatus: CardStatus;
}

export const cardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ADMIN: Get All Cards
    getCards: builder.query<CardsResponse, CardQueryParams>({
      query: (params) => ({
        url: "/admin/cards",
        method: "GET",
        params,
      }),
      providesTags: ["Card"],
    }),

    // ADMIN: Get Single Card
    getCardById: builder.query<
      { success: boolean; data: BankCard },
      string
    >({
      query: (id) => `/admin/cards/${id}`,
      providesTags: ["Card"],
    }),

    // ADMIN: Update Card Status
    updateCardStatus: builder.mutation<
      { success: boolean; message: string; data: BankCard },
      UpdateCardStatusRequest
    >({
      query: ({ id, cardStatus }) => ({
        url: `/admin/cards/${id}/status`,
        method: "PATCH",
        body: { cardStatus },
      }),
      invalidatesTags: ["Card", "Dashboard"],
    }),

    // CUSTOMER: Get Own Cards
    getMyCards: builder.query<CardsResponse, CardQueryParams>({
      query: (params) => ({
        url: "/customer/cards",
        method: "GET",
        params,
      }),
      providesTags: ["Card"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCardsQuery,
  useGetCardByIdQuery,
  useUpdateCardStatusMutation,
  useGetMyCardsQuery,
} = cardApi;
